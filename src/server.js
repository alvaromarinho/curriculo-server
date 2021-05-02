import './config/env.js';
import express from 'express';
import cors from 'cors';
import multiParty from 'connect-multiparty';
import bodyParser from 'body-parser';
import routes from './routes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multiParty());

app.use(cors());
app.use(routes);

// ErrorHandler
app.use((err, req, res, next) => res.status(err.httpStatusCode || 500).json(err.message));

app.listen(process.env.SERVER_PORT, () => {
    console.log(`[${process.env.NODE_ENV || 'dev'}] server runing in port: ${process.env.SERVER_PORT}\n`);
});