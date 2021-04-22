const { Model, sqlFunc } = require('./Model');

class PhoneModel {

    constructor() {
        this.model = new Model('phones');
    }

    async createPhone(obj) {
        const result = await this.model.execute(sqlFunc.INSERT, new Phone(obj).toDb(obj.userId));
        const phone = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!phone) return;

        return new Phone(phone);
    }

    async findPhonesByUserId(userId) {
        const results = await this.model.execute(sqlFunc.SELECT, null, { user_id: userId });
        if (!results) return;

        return Array.isArray(results) ? results.map((res) => new Phone(res)) : new Phone(results);
    }

    async deletePhone(filter) {
        const result = await this.model.execute(sqlFunc.DELETE, null, filter);
        if (!result) return;

        return result.affectedRows;
    }
}

class Phone {
    constructor(obj) {
        this.id = obj.id;
        this.number = obj.number;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            number: this.number,
            user_id: userId
        }));
    }
}

module.exports = PhoneModel;
