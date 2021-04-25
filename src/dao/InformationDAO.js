const { DAO, sql } = require('./DAO');
const Information = require('../models/Information');

class InformationDAO extends DAO {

    constructor() {
        super('informations');
    }

    async createInformation(req) {
        const result = await this.execute(sql.INSERT, new Information(req.body).toDb(req.user.id));
        const [information] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!information) return;

        return new Information(information);
    }

    async findInformationsBy(filter) {
        const informations = await this.execute(sql.SELECT, null, filter);
        if (!informations) return;

        return informations.map((res) => new Information(res));
    }

    async updateInformation(obj) {
        await this.execute(sql.UPDATE, new Information(obj).toDb(), { id: obj.id });
        const [information] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!information) return;

        return new Information(information);
    }

    async deleteInformation(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new InformationDAO();
