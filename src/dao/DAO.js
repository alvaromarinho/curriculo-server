const query = require('../config/db');

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
            const where = typeof whereParams === 'object' ?
                Object.keys(whereParams).map((key) => `${key} = '${whereParams[key]}'`).join(` ${whereConnector} `) :
                whereParams;

            switch (operation) {
                case sql.SELECT:
                    return await query('SELECT * FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
                case sql.INSERT:
                    return await query('INSERT INTO ?? SET ?', [this.table, setParams]);
                case sql.UPDATE:
                    return await query('UPDATE ?? SET ? WHERE ?', [this.table, setParams, { toSqlString: () => where }]);
                case sql.DELETE:
                    return await query('DELETE FROM ?? WHERE ?', [this.table, { toSqlString: () => where }]);
            }
        } catch (error) {
            error.sql && console.log('[erro in SQL]', error.sql)
            throw error.sqlMessage ? new Error(error.sqlMessage.split(';')[0]) : new Error(error);
        }
    }
}

module.exports = { DAO, sql };
