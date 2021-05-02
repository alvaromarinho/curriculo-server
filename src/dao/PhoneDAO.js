import { DAO, sql } from './DAO.js';
import { Phone } from '../models/Phone.js';
import { CustomError } from '../models/CustomError.js';

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

    async findByUserId(filter) {
        const phones = await this.execute(sql.SELECT, null, filter);
        if (!phones) throw new CustomError(404, 'Not found');

        return phones.map((res) => new Phone(res));
    }

    async remove(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

export default new PhoneDAO();