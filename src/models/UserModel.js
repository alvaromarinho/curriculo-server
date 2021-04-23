const { Model, sqlFunc } = require('./Model');
const PhoneModel = require('./PhoneModel');
const SocialNetworkModel = require('./SocialNetworkModel');
const ImageHelper = require('../helpers/ImageHelper');
const bcrypt = require('bcrypt');

const phoneModel = new PhoneModel();
const socialNetworkModel = new SocialNetworkModel();

class UserModel {

    constructor() {
        this.model = new Model('users');
    }

    async createUser(req) {
        if (req.files) req.body.imgUrl = ImageHelper.upload(req.body.email, req.files);

        const result = await this.model.execute(sqlFunc.INSERT, new User(req.body).toDb(req.body.password));
        const user = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!user) return;

        user.socialNetworks = [];
        for (const socialNetwork of req.body.socialNetworks) {
            user.socialNetworks.push(await socialNetworkModel.createSocialNetwork({ ...socialNetwork, userId: user.id }));
        }

        user.phones = [];
        for (const phone of req.body.phones) {
            user.phones.push(await phoneModel.createPhone({ number: phone, userId: user.id }));
        }

        return new User(user);
    }

    async findUserBy(filter, withPass = false) {
        const user = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!user) return;

        user.phones = await phoneModel.findPhonesByUserId(user.id);
        user.socialNetworks = await socialNetworkModel.findSocialNetworksByUserId(user.id);
        return withPass ? { user: new User(user), userPassword: user.password } : new User(user);
    }

    async updateUser(req) {
        await this.model.execute(sqlFunc.UPDATE, new User(req.body).toDb(req.body.password), { id: req.userId });
        const user = await this.model.execute(sqlFunc.SELECT, null, { id: req.userId });
        if (!user) return;

        // PHONES
        if (req.body.phones) {
            const toNotDelete = [];
            const toAdd = [];

            req.body.phones.map((phone) => {
                if(phone.id)
                    toNotDelete.push(phone.id.toString())
                else
                    toAdd.push(phone)
            })

            await phoneModel.deletePhone({ toSqlString: () => `id NOT IN (${toNotDelete})` });
            for (const phone of toAdd) {
                await phoneModel.createPhone({ number: phone.number, userId: req.userId });
            }
        }

        // SOCIAL NETWORKS
        if (req.body.socialNetworks) {
            const toNotDelete = [];
            const toAdd = [];
            const toUpdate = [];

            req.body.socialNetworks.map((socialNetwork) => {
                if(socialNetwork.id) {
                    toNotDelete.push(socialNetwork.id.toString())
                    toUpdate.push(socialNetwork)
                } else {
                    toAdd.push(socialNetwork)
                }
            })

            await socialNetworkModel.deleteSocialNetwork({ toSqlString: () => `id NOT IN (${toNotDelete})` });
            for (const socialNetwork of toUpdate) {
                await socialNetworkModel.updateSocialNetwork(socialNetwork);
            }
            for (const socialNetwork of toAdd) {
                await socialNetworkModel.createSocialNetwork({ ...socialNetwork, userId: req.userId });
            }
        }

        user.socialNetworks = await socialNetworkModel.findSocialNetworksByUserId(req.userId);
        user.phones = await phoneModel.findPhonesByUserId(req.userId);
        return new User(user);
    }

    async deleteUser(id) {
        const user = await this.model.execute(sqlFunc.SELECT, null, { id });
        if (!user) return;

        ImageHelper.deleteFolder(user.email);
        await phoneModel.deletePhone({ user_id: id });
        return await this.model.execute(sqlFunc.DELETE, null, { id });
    }
}

class User {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.imgUrl = obj.imgUrl || obj.img_url;
        this.city = obj.city;
        this.uf = obj.uf;
        this.description = obj.description;
        this.phones = obj.phones;
        this.socialNetworks = obj.socialNetworks;
    }

    toDb(password) {
        return JSON.parse(JSON.stringify({
            name: this.name,
            email: this.email,
            img_url: this.imgUrl,
            city: this.city,
            uf: this.uf,
            password: password && bcrypt.hashSync(password, bcrypt.genSaltSync()),
            description: this.description,
        }));
    }
}

module.exports = UserModel;
