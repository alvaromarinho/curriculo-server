import { DAO, sql } from './DAO.js';
import { SocialNetwork } from '../models/SocialNetwork.js';
import { CustomError } from '../models/CustomError.js';

export class SocialNetworkDAO extends DAO {

    constructor() {
        super('social_networks');
    }

    async create(obj) {
        const result = await this.execute(sql.INSERT, new SocialNetwork(obj).toDb(obj.userId));
        const [socialNetwork] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!socialNetwork) throw new CustomError(404, 'Error creating social network');

        return new SocialNetwork(socialNetwork);
    }

    async findBy(filter) {
        const socialNetworks = await this.execute(sql.SELECT, null, filter);
        if (!socialNetworks) throw new CustomError(404, 'Not found');

        return socialNetworks.map((item) => new SocialNetwork(item));
    }

    async update(obj) {
        await this.execute(sql.UPDATE, new SocialNetwork(obj).toDb(), { id: obj.id });
        const [socialNetwork] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!socialNetwork) throw new CustomError(404, 'Not found');

        return new SocialNetwork(socialNetwork);
    }

    async remove(filter) {
        return await this.execute(sql.DELETE, null, filter);
    }
}

export default new SocialNetworkDAO();