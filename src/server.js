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

app.use((error, req, res, next) => {
    res.status(error.httpStatusCode).json(error.responseMessage || "Internal Server Error");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`server runing in port:${ process.env.PORT || 3000 }`);
});