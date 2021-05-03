const mysql = require('mysql2');
const util = require('util');

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

conn.connect((err) => {
    if (err) throw err;
    console.log('DB Connected!\n');
});

module.exports = (sql, args) => util.promisify(conn.query).call(conn, sql, args);
