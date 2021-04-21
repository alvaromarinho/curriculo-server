const mysql = require('mysql');
const util = require('util');

const con = mysql.createConnection({
    hots: "localhost",
    user: 'root',
    password: 'root',
    database: 'alvin'
});

con.connect((err) => {
    if (err) throw err;
    console.log("DB Connected!\n");
});

module.exports = {
    query(sql, args) {
        return util.promisify(con.query).call(con, sql, args);
    }, close() {
        return util.promisify(con.end).call(con);
    }
};
