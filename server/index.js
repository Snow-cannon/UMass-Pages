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

//Search room data
app.post('/searchArea', (req, res) => {
    res.json({ data: "ok" });
});

//Search room data
app.put('/uploadArea', (req, res) => {
    res.json({ data: "ok" });
});

//Match invalid server requests
app.all('*', async (request, response) => {
    response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => { console.log(`Server started on port ${port}`) });