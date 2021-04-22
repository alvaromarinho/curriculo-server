const connection = require('../config/db');

const sqlFunc = {
    SELECT: 'SELECT',
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
}

class Model {
    constructor(table) {
        this.table = table;
    }

    async execute(operation, setObject, whereObject) {
        try {
            switch (operation) {
                case sqlFunc.SELECT:
                    const res = await connection.query('SELECT * FROM ?? WHERE ?', [this.table, whereObject]);
                    return res.length > 1 ? res : res[0];
                case sqlFunc.INSERT: return await connection.query('INSERT INTO ?? SET ?', [this.table, setObject]);
                case sqlFunc.UPDATE: return await connection.query('UPDATE ?? SET ? WHERE ?', [this.table, setObject, whereObject]);
                case sqlFunc.DELETE: return await connection.query('DELETE FROM ?? WHERE ?', [this.table, whereObject]);
            }
        } catch (error) {
            console.log('[erro in SQL]', error.sql || error)
            throw error;
        }
    }
}

module.exports = { Model, sqlFunc };
