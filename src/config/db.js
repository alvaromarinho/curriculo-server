const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

con.connect((err) => {
    if (err) throw err;
    console.log('DB Connected!\n');
});

module.exports = {
    query(sql, args) {
        return util.promisify(con.query).call(con, sql, args);
    },
    close() {
        return util.promisify(con.end).call(con);
    }
};