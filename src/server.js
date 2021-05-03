require('dotenv').config({ path: process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env' });

const express = require('express');
const multiParty = require('connect-multiparty');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multiParty());
app.use(cors());
app.use(routes);

// ErrorHandler
app.use((err, req, res, next) => res.status(err.httpStatusCode || 500).json(err.message));

app.listen(process.env.SERVER_PORT, () => {
    console.log(`[${process.env.NODE_ENV || 'dev'}] server runing in port: ${process.env.SERVER_PORT}\n`);
});