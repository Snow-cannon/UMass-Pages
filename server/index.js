import { database } from './database.js';
import express from 'express';
import logger from 'morgan';
import { buildQueryData, makeID } from './serverUtils.js';

//Create express application
const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json({ limit: '1MB' }));

//Statically serve client files
app.use('/', express.static('client'));

await database.connect();

//CREATE
app.put('/createArea', async (req, res) => {
    let result = await database.createArea(...buildQueryData(req.body, true));
    if (result.ok) {
        res.json({ data: "ok" });
    } else {
        console.log(result.error);
        res.json({ error: result.error });
    }
});

//READ
app.get('/searchArea\*', async (req, res) => {
    let result = await database.searchAreas(...buildQueryData(req.query));
    if (result.ok) {
        res.json({ data: "ok" });
    } else {
        console.log(result.error);
        res.json({ error: result.error });
    }
});

//UPDATE
app.put('/updateArea', async (req, res) => {
    let result = await database.updateArea(...buildQueryData(req.body));
    if(result.ok){
        console.log(result.rows);
        res.json({ data: "ok" });
    } else {
        console.log(result.error);
        res.json({ error: result.error });
    }
});

//DELETE
app.put('/deleteArea', async (req, res) => {
    let result = await database.deleteArea(req.body.id);
    if(result.ok){
        console.log(result.rows);
        res.json({ data: "ok" });
    } else {
        console.log(result.error);
        res.json({ error: result.error });
    }
});

//Match invalid server requests
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => { console.log(`Server started on port ${port}`) });