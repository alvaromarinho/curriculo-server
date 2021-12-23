const { DAO, sql } = require('./DAO');
const Link = require('../models/Link');
const CustomError = require('../models/CustomError');

class LinkDAO extends DAO {

    constructor() {
        super('social_networks');
    }

    async create(obj) {
        const result = await this.execute(sql.INSERT, new Link(obj).toDb(obj.userId));
        const [link] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!link) throw new CustomError(404, 'Error creating social network');

        return new Link(link);
    }

    async findBy(filter) {
        const links = await this.execute(sql.SELECT, null, filter);
        if (!links) throw new CustomError(404, 'No social network found');

        return links.map((item) => new Link(item));
    }

    async update(obj) {
        await this.execute(sql.UPDATE, new Link(obj).toDb(), { id: obj.id });
        const [link] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!link) throw new CustomError(404, 'No social network found');

        return new Link(link);
    }

    async remove(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new LinkDAO();