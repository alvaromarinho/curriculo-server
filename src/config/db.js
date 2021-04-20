const mysql = require('mysql');

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

module.exports = con;
