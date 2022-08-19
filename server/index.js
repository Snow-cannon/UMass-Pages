import { database } from './database.js';
import express from 'express';
import logger from 'morgan';
import { buildQueryData } from './serverUtils.js';
import expressSession from 'express-session';
import auth from './auth.js';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// We will use __dirname later on to send files back to the client.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

//Sessions
const sessionConfig = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
};

//Create express application
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json({ limit: '2MB' }));
app.use(expressSession(sessionConfig));
auth.configure(app);

//Statically serve client files
app.use('/', express.static('client'));

await database.connect();

function sendHTML(res) {
    res.sendFile('/client/index.html', { root: __dirname });
}

console.log(__dirname)

// ALL CRUD OPERATIONS

//CREATE
app.put('/createArea', checkLoggedIn, async (req, res) => {
    let result = await database.createArea(...buildQueryData(req.body, true));
    if (result.ok) {
        res.json({ ok: true });
    } else {
        res.json({ ok: false, error: result.error });
    }
});

//READ (Searching is allowed by anyone. Only modifications require a login)
app.get('/searchArea\*', async (req, res) => {
    let result = await database.searchAreas(...buildQueryData(req.query));
    if (result.ok) {
        res.json({ ok: true, result: result });
    } else {
        res.json({ ok: false, error: result.error });
    }
});

//UPDATE
app.put('/updateArea', checkLoggedIn, async (req, res) => {
    let result = await database.updateArea(...buildQueryData(req.body));
    if (result.ok) {
        res.json({ ok: true });
    } else {
        res.json({ ok: false, error: result.error });
    }
});

//DELETE
app.put('/deleteArea', checkLoggedIn, async (req, res) => {
    let result = await database.deleteArea(req.body.id);
    if (result.ok) {
        res.json({ ok: true });
    } else {
        res.json({ ok: false, error: result.error });
    }
});


/**
 * ALL LOGIN ROUTES
 */

// Our own middleware to check if the user is authenticated
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/login');
    }
}

app.get('/', checkLoggedIn, (req, res) => {

});

// Handle the URL /login (just output the html file).
app.get('/login', (req, res) => {
    res.sendFile('/client/index.html', { root: __dirname });
});

// Handle post data from the login.html form.
app.post(
    '/login',
    auth.authenticate('local', {
        // use username/password authentication
        successRedirect: '/private', // when we login, go to /private
        failureRedirect: '/login', // otherwise, back to login
    })
);

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!await database.userExists(username, password)) {
        await database.addUser(username, password);
        res.redirect('/login');
    } else {
        res.redirect('/register');
    }
});

app.get('/users', async (req, res) => {
    res.json({ users: await database.getAllUsers() });
});

app.get('/areas', async (req, res) => {
    res.json({ places: await database.getAllAreas() });
});

// Register URL
app.get('/register', (req, res) => sendHTML(res));

// Private data
app.get(
    '/private',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {
        // Go to the user's page.
        // res.redirect('/private/' + req.user);
        res.sendFile('/client/index.html', { root: __dirname });
    }
);

/** OTHER */

//Match invalid server requests
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => { console.log(`Server started on port ${port}`) });