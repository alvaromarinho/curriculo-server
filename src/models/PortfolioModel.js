const { Model, sqlFunc } = require('./Model');

class PortfoliosModel {

    constructor() {
        this.model = new Model('portfolios');
    }

    async createPortfolio(req) {
        const result = await this.model.execute(sqlFunc.INSERT, new Portfolio(req.body).toDb(req.userId));
        const portfolio = await this.model.execute(sqlFunc.SELECT, null, { id: result.insertId });
        if (!portfolio) return;

        return new Portfolio(portfolio);
    }

    async findPortfoliosBy(filter) {
        const portfolios = await this.model.execute(sqlFunc.SELECT, null, filter);
        if (!portfolios) return;

        return Array.isArray(portfolios) ? portfolios.map((res) => new Portfolio(res)) : new Portfolio(portfolios);
    }

    async updatePortfolio(obj) {
        await this.model.execute(sqlFunc.UPDATE, new Portfolio(obj).toDb(), { id: obj.id });
        const portfolio = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!portfolio) return;

        return new Portfolio(portfolio);
    }

    async deletePortfolio(filter) {
        return await this.model.execute(sqlFunc.DELETE, null, filter);
    }
}

class Portfolio {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
    }

    toDb(userId) {
        return JSON.parse(JSON.stringify({
            id: this.id,
            name: this.name,
            user_id: userId
        }));
    }
}

module.exports = PortfoliosModel;
