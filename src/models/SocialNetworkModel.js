const { Model, sqlFunc } = require('./Model');

class SocialNetworkModel {

    constructor() {
        this.model = new Model('social_networks');
    }

    async createSocialNetwork(obj) {
        const result = await this.model.execute(sqlFunc.INSERT, new SocialNetwork(obj).toDb(obj.userId));
        const socialNetwork = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!socialNetwork) return;

        return new SocialNetwork(socialNetwork);
    }

    async findSocialNetworksByUserId(userId) {
        const socialNetworks = await this.model.execute(sqlFunc.SELECT, null, { user_id: userId });
        if (!socialNetworks) return;

        return Array.isArray(socialNetworks) ? socialNetworks.map((res) => new SocialNetwork(res)) : new SocialNetwork(socialNetworks);
    }

    async updateSocialNetwork(obj) {   
        await this.model.execute(sqlFunc.UPDATE, new SocialNetwork(obj).toDb(), { id: obj.id });
        const socialNetwork = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!socialNetwork) return;

        return new SocialNetwork(socialNetwork);
    }

    async deleteSocialNetwork(filter) {
        return await this.model.execute(sqlFunc.DELETE, null, filter);
    }
}

class SocialNetwork {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.icon = obj.icon;
        this.url = obj.url;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            name: this.name,
            icon: this.icon,
            url: this.url,
            user_id: userId
        }));
    }
}

module.exports = SocialNetworkModel;
