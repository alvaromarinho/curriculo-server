const { DAO, sql } = require('./DAO');
const { uploadImage, deleteFile, deleteFolder } = require('../helpers/ImageHelper');
const User = require('../models/User');
const CustomError = require('../models/CustomError');

const phoneDAO = require('./PhoneDAO');
const socialNetworkDAO = require('./SocialNetworkDAO');
const informationDAO = require('./InformationDAO');
const portfolioDAO = require('./PortfolioDAO');

class UserDAO extends DAO {

    constructor() {
        super('users');
    }

    async create(req) {
        if (req.files) req.body.image = uploadImage(req.body.email, req.files.image);

        const result = await this.execute(sql.INSERT, new User(req.body).toDb(req.body.password));
        const [user] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!user) {
            deleteFile(req.body.image);
            throw new CustomError(400, 'Error creating user');
        };

        user.phones = [];
        for (const phone of req.body.phones) {
            user.phones.push(await phoneDAO.create({ number: phone, userId: user.id }));
        }

        user.socialNetworks = [];
        for (const socialNetwork of req.body.socialNetworks) {
            user.socialNetworks.push(await socialNetworkDAO.create({ ...socialNetwork, userId: user.id }));
        }

        return user.length > 1 ? user.map((item) => new User(item)) : new User(user);
    }

    async findBy(filter, withPass = false) {
        const [user] = await this.execute(sql.SELECT, null, filter);
        if (!user) throw new CustomError(404, 'Not found');

        user.phones = await phoneDAO.findBy({ user_id: user.id }) || [];
        user.socialNetworks = await socialNetworkDAO.findBy({ user_id: user.id }) || [];
        return withPass ? { user: new User(user, true), userPassword: user.password } : new User(user, true);
    }

    async update(req) {
        await this.execute(sql.UPDATE, new User(req.body).toDb(req.body.password), { id: req.user.id });
        const [user] = await this.execute(sql.SELECT, null, { id: req.user.id });
        if (!user) throw new CustomError(404, 'Not found');

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

            await phoneDAO.remove(`id NOT IN (${toNotDelete})`);
            for (const phone of toAdd) {
                await phoneDAO.create({ number: phone.number, userId: req.user.id });
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

            await socialNetworkDAO.remove(`id NOT IN (${toNotDelete})`);
            for (const socialNetwork of toUpdate) {
                await socialNetworkDAO.update(socialNetwork);
            }
            for (const socialNetwork of toAdd) {
                await socialNetworkDAO.create({ ...socialNetwork, userId: req.user.id });
            }
        }

        user.phones = await phoneDAO.findByUserId({ user_id: req.user.id });
        user.socialNetworks = await socialNetworkDAO.findBy({ user_id: req.user.id });
        return new User(user);
    }

    async removeById(id) {
        const [user] = await this.execute(sql.SELECT, null, { id });
        if (!user) throw new CustomError(404, 'Not found');

        deleteFolder(user.email);
        await phoneDAO.remove({ user_id: id });
        await socialNetworkDAO.remove({ user_id: id });
        await informationDAO.remove({ user_id: id });
        await portfolioDAO.remove({ user_id: id });
        return await this.execute(sql.DELETE, null, { id });
    }
}

module.exports = new UserDAO();