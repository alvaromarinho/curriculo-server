const { Model, sqlFunc } = require('./Model');
const PhoneModel = require('./PhoneModel');
const ImageHelper = require('../helpers/ImageHelper');
const bcrypt = require('bcrypt');

const phoneModel = new PhoneModel();

class UserModel {

    constructor() {
        this.model = new Model('users');
    }

    async createUser(req) {
        if (req.files) req.body.imgUrl = ImageHelper.upload(req.body.email, req.files);

        const phones = req.body.phones || [];
        const result = await this.model.execute(sqlFunc.INSERT, new User(req.body).toDb(req.body.password));
        const user = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!user) return;

        user.phones = [];
        for (const phone of phones) {
            user.phones.push(await phoneModel.createPhone({ number: phone, userId: user.id }));
        }

        return new User(user);
    }

    async findUserBy(filter, withPass = false) {
        const result = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!result) return;

        result.phones = await phoneModel.findPhonesByUserId(result.id);
        return withPass ? { user: new User(result), userPassword: result.password } : new User(result);
    }

    async updateUser(req) {
        await this.model.execute(sqlFunc.UPDATE, new User(req.body).toDb(req.body.password), { id: req.userId });
        const user = await this.model.execute(sqlFunc.SELECT, null, { id: req.userId });
        if (!user) return;

        // PHONES
        if (req.body.phones) {
            const toNotDelete = []
            req.body.phones.filter((phone) => phone.id).map((phone) => toNotDelete.push(phone.id.toString()));

            await phoneModel.deletePhone({ toSqlString: () => `id NOT IN (${toNotDelete})` });
            const toAdd = req.body.phones.filter((phone) => !phone.id);
            for (const phone of toAdd) {
                await phoneModel.createPhone({ number: phone.number, userId: req.userId });
            }
        }

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