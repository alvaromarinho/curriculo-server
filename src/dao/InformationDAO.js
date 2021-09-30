const { DAO, sql } = require('./DAO');
const Information = require('../models/Information');
const CustomError = require('../models/CustomError');

class InformationDAO extends DAO {

    constructor() {
        super('informations');
    }

    async create(req) {
        const result = await this.execute(sql.INSERT, new Information(req.body).toDb(req.user.id));
        const [information] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!information) throw new CustomError(404, 'Error creating phone');

        return new Information(information);
    }

    async findBy(filter) {
        const informations = await this.execute(sql.SELECT, null, filter);
        if (!informations) throw new CustomError(404, 'No information found');

        return informations.map((res) => new Information(res));
    }

    async update(obj) {
        await this.execute(sql.UPDATE, new Information(obj).toDb(), { id: obj.id });
        const [information] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!information) throw new CustomError(404, 'No information found');

        return new Information(information);
    }

    async remove(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new InformationDAO();