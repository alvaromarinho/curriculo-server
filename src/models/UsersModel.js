const connection = require('../config/db')();

const insert = (data, callback) => {
    connection.query('INSERT INTO user SET ?', data, (err, res) => {
        callback(err, res);
    });
}

const select = (data, callback) => {
    connection.query('SELECT * FROM user WHERE ?', data, (err, res) => {
        callback(err, res.length > 1 ? res : res[0]);
    })
}

const update = (data, id, callback) => {
    connection.query('UPDATE user SET ? WHERE ?', [data, id], (err, res) => {
        callback(err, res);
    });
}

const remove = (data, callback) => {
    connection.query('DELETE FROM user WHERE ?;', data, (err, res) => {
        callback(err, res);
    });
}

module.exports = { insert, select, update, remove }
