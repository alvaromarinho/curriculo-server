const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const multiParty = require('connect-multiparty');
const bodyParser = require('body-parser');

// const { databaseUrl, env } = require("./config/configs")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:false } ));
app.use(multiParty());

app.use(cors());
app.use(routes);

app.use((err, req, res, next) => {
    console.log(`[error] ${req.method} => ${req.url}`);
    res.status(err.httpStatusCode || 500).json(err.responseMessage);
});

app.listen(3001, () => {
    console.log(`server runing in port: 3001\n`);
});