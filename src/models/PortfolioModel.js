const { Model, sqlFunc } = require('./Model');
const ProjectModel = require('../models/ProjectModel');

const projectModel = new ProjectModel();

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

        if (Array.isArray(portfolios)) {
            for (const portfolio of portfolios) {
                portfolio.projects = await projectModel.findProjectsBy({ portfolio_id: portfolio.id }) || [];
            }
            return portfolios.map((res) => new Portfolio(res));
        } else {
            portfolios.projects = await projectModel.findProjectsBy({ portfolio_id: portfolios.id }) || [];
            return new Portfolio(portfolios);
        }
    }

    async updatePortfolio(obj) {
        await this.model.execute(sqlFunc.UPDATE, new Portfolio(obj).toDb(), { id: obj.id });
        const portfolio = await this.model.execute(sqlFunc.SELECT, null, { id: obj.id });
        if (!portfolio) return;

        return new Portfolio(portfolio);
    }

    async deletePortfolio(id) {
        await projectModel.deleteProject({ portfolio_id: id });
        return await this.model.execute(sqlFunc.DELETE, null, { id });
    }
}

class Portfolio {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.projects = obj.projects;
        this.userId = obj.userId || obj.user_id;
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
