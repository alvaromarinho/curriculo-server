const connection = require('../config/db');

const sql = {
    SELECT: 'SELECT',
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
}

class DAO {
    constructor(table) {
        this.table = table;
    }

    async execute(operation, setParams, whereParams = '1=1', whereConnector = 'AND') {
        try {
            const where = typeof whereParams === 'object'
                ? Object.keys(whereParams).map((key) => `${key} = '${whereParams[key]}'`).join(` ${whereConnector} `)
                : whereParams;

            switch (operation) {
                case sql.SELECT:
                    return await connection.query('SELECT * FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
                case sql.INSERT:
                    return await connection.query('INSERT INTO ?? SET ?', [this.table, setParams]);
                case sql.UPDATE:
                    return await connection.query('UPDATE ?? SET ? WHERE ?', [this.table, setParams, { toSqlString: () => where }]);
                case sql.DELETE:
                    return await connection.query('DELETE FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
            }
        } catch (error) {
            console.log('[erro in SQL]', error.sql)
            throw new Error(error.sqlMessage.split(';')[0]);
        }
    }
}

module.exports = { DAO, sql };
