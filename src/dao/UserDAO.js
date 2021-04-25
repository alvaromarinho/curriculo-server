const { DAO, sql } = require('./DAO');
const ImageHelper = require('../helpers/ImageHelper');
const User = require('../models/User');

const phoneDAO = require('./PhoneDAO');
const socialNetworkDAO = require('./SocialNetworkDAO');
const informationDAO = require('./InformationDAO');
const portfolioDAO = require('./PortfolioDAO');

class UserDAO extends DAO {

    constructor() {
        super('users');
    }

    async createUser(req) {
        if (req.files) req.body.image = ImageHelper.upload(req.body.email, req.files.image);

        const result = await this.execute(sql.INSERT, new User(req.body).toDb(req.body.password));
        const [user] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!user) {
            ImageHelper.deleteFile(req.body.image);
            return;
        };

        user.phones = [];
        for (const phone of req.body.phones) {
            user.phones.push(await phoneDAO.createPhone({ number: phone, userId: user.id }));
        }

        user.socialNetworks = [];
        for (const socialNetwork of req.body.socialNetworks) {
            user.socialNetworks.push(await socialNetworkDAO.createSocialNetwork({ ...socialNetwork, userId: user.id }));
        }

        return user.length > 1 ? user.map((item) => new User(item)) : new User(user);
    }

    async findUserBy(filter, withPass = false) {
        const [user] = await this.execute(sql.SELECT, null, filter);
        if (!user) return;

        user.phones = await phoneDAO.findPhonesByUserId({ user_id: user.id });
        user.socialNetworks = await socialNetworkDAO.findSocialNetworksBy({ user_id: user.id });
        return withPass ? { user: new User(user, true), userPassword: user.password } : new User(user, true);
    }

    async updateUser(req) {
        await this.execute(sql.UPDATE, new User(req.body).toDb(req.body.password), { id: req.user.id });
        const [user] = await this.execute(sql.SELECT, null, { id: req.user.id });
        if (!user) return;

        // PHONES
        if (req.body.phones) {
            const toNotDelete = [];
            const toAdd = [];

            req.body.phones.map((phone) => {
                if (phone.id)
                    toNotDelete.push(phone.id.toString())
                else
                    toAdd.push(phone)
            })

            await phoneDAO.deletePhone(`id NOT IN (${toNotDelete})`);
            for (const phone of toAdd) {
                await phoneDAO.createPhone({ number: phone.number, userId: req.user.id });
            }
        }

        // SOCIAL NETWORKS
        if (req.body.socialNetworks) {
            const toNotDelete = [];
            const toAdd = [];
            const toUpdate = [];

            req.body.socialNetworks.map((socialNetwork) => {
                if (socialNetwork.id) {
                    toNotDelete.push(socialNetwork.id.toString())
                    toUpdate.push(socialNetwork)
                } else {
                    toAdd.push(socialNetwork)
                }
            })

            await socialNetworkDAO.deleteSocialNetwork(`id NOT IN (${toNotDelete})`);
            for (const socialNetwork of toUpdate) {
                await socialNetworkDAO.updateSocialNetwork(socialNetwork);
            }
            for (const socialNetwork of toAdd) {
                await socialNetworkDAO.createSocialNetwork({ ...socialNetwork, userId: req.user.id });
            }
        }

        user.phones = await phoneDAO.findPhonesByUserId({ user_id: req.user.id });
        user.socialNetworks = await socialNetworkDAO.findSocialNetworksBy({ user_id: req.user.id });
        return new User(user);
    }

    async deleteUser(id) {
        const [user] = await this.execute(sql.SELECT, null, { id });
        if (!user) return;

        ImageHelper.deleteFolder(user.email);
        await phoneDAO.deletePhone({ user_id: id });
        await socialNetworkDAO.deleteSocialNetwork({ user_id: id });
        await informationDAO.deleteInformation({ user_id: id });
        await portfolioDAO.deletePortfolio({ user_id: id });
        return await this.execute(sql.DELETE, null, { id });
    }
}

module.exports = new UserDAO();