const { DAO, sql } = require('./DAO');
const Phone = require('../models/Phone');
const CustomError = require('../models/CustomError');

class PhoneDAO extends DAO {

    constructor() {
        super('phones');
    }

    async create(obj) {
        const result = await this.execute(sql.INSERT, new Phone(obj).toDb(obj.userId));
        const [phone] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!phone) throw new CustomError(404, 'Error creating phone');

        return new Phone(phone);
    }

    async findBy(filter) {
        const phones = await this.execute(sql.SELECT, null, filter);
        if (!phones) throw new CustomError(404, 'No phone found');

        return phones.map((res) => new Phone(res));
    }

    async remove(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new PhoneDAO();