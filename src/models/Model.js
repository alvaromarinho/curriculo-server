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

    async execute(operation, setObject, whereObject, whereConnector = 'AND') {
        try {
            const where = whereObject ? Object.keys(whereObject).map((key) => `${key} = '${whereObject[key]}'`).join(` ${whereConnector} `) : '1=1';
            switch (operation) {
                case sqlFunc.SELECT:
                    const res = await connection.query('SELECT * FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
                    return res.length > 1 ? res : res[0];
                case sqlFunc.INSERT: return await connection.query('INSERT INTO ?? SET ?', [this.table, setObject]);
                case sqlFunc.UPDATE: return await connection.query('UPDATE ?? SET ? WHERE ?', [this.table, setObject, { toSqlString: () => where }]);
                case sqlFunc.DELETE: return await connection.query('DELETE FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
            }
        } catch (error) {
            console.log('[erro in SQL]', error.sql || error)
            throw error;
        }
    }
}

module.exports = { Model, sqlFunc };
