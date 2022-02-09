const { DAO, sql } = require('./DAO');
const { uploadImage, deleteFile, deleteFolder } = require('../helpers/ImageHelper');
const User = require('../models/User');
const CustomError = require('../models/CustomError');

const phoneDAO = require('./PhoneDAO');
const linkDAO = require('./LinkDAO');
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

        user.links = [];
        for (const link of req.body.links) {
            user.links.push(await linkDAO.create({ ...link, userId: user.id }));
        }

        return user.length > 1 ? user.map((item) => new User(item)) : new User(user);
    }

    async findBy(filter, withPass = false) {
        const [user] = await this.execute(sql.SELECT, null, filter);
        if (!user) throw new CustomError(404, 'No user found');
        if(!withPass) {
            user.phones = await phoneDAO.findBy({ user_id: user.id }) || [];
            user.links = await linkDAO.findBy({ user_id: user.id }) || [];
        }
        return withPass ? { user: new User(user), userPassword: user.password } : new User(user);
    }

    async update(req) {
        if (req.files && req.files.length) {
            deleteFile(req.body.image);
            req.body.image = uploadImage(req.body.email, req.files.image);
        }

        const setParams = new User(req.body).toDb(req.body.password)
        if(Object.keys(setParams).length > 0)
            await this.execute(sql.UPDATE, new User(req.body).toDb(req.body.password), { id: req.user.id });
            
        const [user] = await this.execute(sql.SELECT, null, { id: req.user.id });
        if (!user) throw new CustomError(404, 'No user found');

        // PHONES
        if (req.body.phones) {
            const toNotDelete = [];
            const toAdd = [];
            const toUpdate = [];

            req.body.phones.map((phone) => {
                if (phone.id) {
                    toNotDelete.push(phone.id.toString())
                    toUpdate.push(phone)
                } else {
                    toAdd.push(phone)
                }
            })

            await phoneDAO.remove(toNotDelete.length ? `id NOT IN (${toNotDelete})` : '1=1');
            for (const phone of toUpdate) {
                await phoneDAO.update(phone);
            }
            for (const phone of toAdd) {
                await phoneDAO.create({ number: phone.number, userId: req.user.id });
            }
        }

        // SOCIAL NETWORKS
        if (req.body.links) {
            const toNotDelete = [];
            const toAdd = [];
            const toUpdate = [];

            req.body.links.map((link) => {
                if (link.id) {
                    toNotDelete.push(link.id.toString())
                    toUpdate.push(link)
                } else {
                    toAdd.push(link)
                }
            })

            await linkDAO.remove(toNotDelete.length ? `id NOT IN (${toNotDelete})` : '1=1');
            for (const link of toUpdate) {
                await linkDAO.update(link);
            }
            for (const link of toAdd) {
                await linkDAO.create({ ...link, userId: req.user.id });
            }
        }

        user.phones = await phoneDAO.findBy({ user_id: req.user.id });
        user.links = await linkDAO.findBy({ user_id: req.user.id });
        return new User(user);
    }

    async removeById(id) {
        const [user] = await this.execute(sql.SELECT, null, { id });
        if (!user) throw new CustomError(404, 'No user found');

        deleteFolder(user.email);
        await phoneDAO.remove({ user_id: id });
        await linkDAO.remove({ user_id: id });
        await informationDAO.remove({ user_id: id });
        await portfolioDAO.remove({ user_id: id });
        return await this.execute(sql.DELETE, null, { id });
    }
}

module.exports = new UserDAO();