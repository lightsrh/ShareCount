import express, { Request, Response } from 'express';
import * as core from "express-serve-static-core";
import bodyParser from 'body-parser';


const app: core.Express = express();
const port: number = 5432;
const db = require('./queries');

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Hello World!');
});

app.get('/test', db.getAll);

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});


