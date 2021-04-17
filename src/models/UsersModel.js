const connection = require('../config/db')();

const insert = (data, callback) => {
    connection.query(`INSERT INTO user SET ?;`, data.toDb(), (err, res) => {
        if(err) {
            throw new Error();
        }
        callback(res);
    });
}

const select = (data, callback) => {
    connection.query(`SELECT * FROM user WHERE ?;`, data, (err, res) => {
        if(err || res.length === 0) {
            throw err;
        }
        callback(res.length > 1 ? res : res[0]);
    });
}

const update = (data, callback) => {
    connection.query(`UPDATE user WHERE ?;`, data, (err, res) => {
        if(err || res.length === 0) {
            throw err;
        }
        callback(res.length > 1 ? res : res[0]);
    });
}

const remove = (data, callback) => {
    connection.query(`DELETE user WHERE ?;`, data, (err, res) => {
        if(err) {
            throw err;
        }
        callback(res);
    });
}


module.exports = {
    insert,
    select,
    remove
}