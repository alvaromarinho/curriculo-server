const express = require("express");
const routes = require("./routes");
const cors = require("cors");
// const { databaseUrl, env } = require("./config/configs")

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((error, req, res, next) => {
  res.status(error.httpStatusCode).json(error.responseMessage || "Internal Server Error");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`server runing in port:${process.env.PORT || 3000}`);
});