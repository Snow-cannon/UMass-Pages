import { database } from './database.js';
import express from 'express';
import logger from 'morgan';
import { makeID } from './serverUtils.js';

//Create express application
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

//Statically serve client files
app.use('/', express.static('client'));

//CREATE
app.put('/createArea', (req, res) => {
    res.json({ data: "ok" });
});

//READ
app.get('/searchArea\*', (req, res) => {
    // let query = url.parse(req.url, true).query;
    res.json({ data: req.query });
});

//UPDATE
app.put('/updateArea', (req, res) => {
    res.json({ data: "ok" });
});

//DELETE
app.put('/deleteArea', (req, res) => {
    res.json({ data: "ok" });
});

//Match invalid server requests
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => { console.log(`Server started on port ${port}`) });