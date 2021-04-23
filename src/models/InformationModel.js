const { Model, sqlFunc } = require('./Model');

class InformationModel {

    constructor() {
        this.model = new Model('informations');
    }

    async createInformation(req) {
        const result = await this.model.execute(sqlFunc.INSERT, new Information(req.body).toDb(req.userId));
        const information = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!information) return;

        return new Information(information);
    }

    async findInformationsBy(filter) {
        const informations = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!informations) return;

        return Array.isArray(informations) ? informations.map((res) => new Information(res)) : new Information(informations);
    }

    async updateInformation(obj) {
        await this.model.execute(sqlFunc.UPDATE, new Information(obj).toDb(), { id: obj.id });
        const information = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!information) return;

        return new Information(information);
    }

    async deleteInformation(filter) {
        return await this.model.execute(sqlFunc.DELETE, null, filter);
    }
}

class Information {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.subtitle = obj.subtitle;
        this.description = obj.description;
        this.type = obj.type;
        this.start = obj.start;
        this.end = obj.end;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            description: this.description,
            type: this.type,
            start: this.start,
            end: this.end,
            user_id: userId
        }));
    }
}

module.exports = InformationModel;
