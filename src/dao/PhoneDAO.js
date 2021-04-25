const { DAO, sql } = require('./DAO');
const Phone = require('../models/Phone');

class PhoneDAO extends DAO {

    constructor() {
        super('phones');
    }

    async createPhone(obj) {
        const result = await this.execute(sql.INSERT, new Phone(obj).toDb(obj.userId));
        const [phone] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!phone) return;

        return new Phone(phone);
    }

    async findPhonesByUserId(filter) {
        const phones = await this.execute(sql.SELECT, null, filter);
        if (!phones.length) return;

        return phones.map((res) => new Phone(res));
    }

    async deletePhone(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new PhoneDAO();
