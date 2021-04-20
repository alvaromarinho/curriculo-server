const connection = require('../config/db');

const insert = (table, setObject, callback) => {
    connection.query('INSERT INTO ?? SET ?', [table, setObject], (err, res) => {
        callback(err, res);
    });
}

const select = (table, whereObject, callback) => {
    connection.query('SELECT * FROM ?? WHERE ?', [table, whereObject], (err, res) => {
        callback(err, res.length > 1 ? res : res[0]);
    })
}

const update = (table, setObject, whereObject, callback) => {
    connection.query('UPDATE ?? SET ? WHERE ?', [table, setObject, whereObject], (err, res) => {
        callback(err, res);
    });
}

const remove = (table, whereObject, callback) => {
    connection.query('DELETE FROM ?? WHERE ?', [table, whereObject], (err, res) => {
        callback(err, res);
    });
}

module.exports = { insert, select, update, remove }
