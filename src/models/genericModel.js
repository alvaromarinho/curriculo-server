const connection = require('../config/db');

module.exports = async (type, table, setObject, whereObject) => {
    try {
        switch (type) {
            case 'SELECT':
                const res = await connection.query('SELECT * FROM ?? WHERE ?', [table, whereObject]);
                return res.length > 1 ? res : res[0];
            case 'INSERT': return await connection.query('INSERT INTO ?? SET ?', [table, setObject]);
            case 'UPDATE': return await connection.query('UPDATE ?? SET ? WHERE ?', [table, setObject, whereObject]);
            case 'DELETE': return await connection.query('DELETE FROM ?? WHERE ?', [table, whereObject]);
        }
    } catch (error) {
        console.log('[erro in SQL]', error.sql)
        throw error;
    }
}
