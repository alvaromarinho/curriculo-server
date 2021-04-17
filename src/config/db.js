const mysql = require('mysql');

const con = mysql.createConnection({
    hots: "localhost",
    user: 'root',
    password: 'root',
    database: 'alvin'
});


module.exports = () => {
    return mysql.createConnection({
        hots: "localhost",
        user: 'root',
        password: 'root',
        database: 'alvin'
    });
}
