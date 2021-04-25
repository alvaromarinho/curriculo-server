const { DAO, sql } = require('./DAO');
const SocialNetwork = require('../models/SocialNetwork');

class SocialNetworkDAO extends DAO {

    constructor() {
        super('social_networks');
    }

    async createSocialNetwork(obj) {
        const result = await this.execute(sql.INSERT, new SocialNetwork(obj).toDb(obj.userId));
        const [socialNetwork] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!socialNetwork) return;

        return new SocialNetwork(socialNetwork);
    }

    async findSocialNetworksBy(filter) {
        const socialNetworks = await this.execute(sql.SELECT, null, filter);
        if (!socialNetworks.length) return;

        return socialNetworks.map((item) => new SocialNetwork(item));
    }

    async updateSocialNetwork(obj) {
        await this.execute(sql.UPDATE, new SocialNetwork(obj).toDb(), { id: obj.id });
        const [socialNetwork] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!socialNetwork) return;

        return new SocialNetwork(socialNetwork);
    }

    async deleteSocialNetwork(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new SocialNetworkDAO();
