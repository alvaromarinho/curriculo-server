const { DAO, sql } = require('./DAO');
const Portfolio = require('../models/Portfolio');

const projectDAO = require('./ProjectDAO');

class PortfolioDAO extends DAO {

    constructor() {
        super('portfolios');
    }

    async createPortfolio(req) {
        const result = await this.execute(sql.INSERT, new Portfolio(req.body).toDb(req.user.id));
        const [portfolio] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!portfolio) throw new CustomError(404, 'Error creating porfolio');

        return new Portfolio(portfolio);
    }

    async findPortfoliosBy(filter) {
        const portfolios = await this.execute(sql.SELECT, null, filter);
        if (!portfolios) throw new CustomError(404, 'Not found');

        for (const portfolio of portfolios) {
            portfolio.projects = await projectDAO.findProjectsBy({ portfolio_id: portfolio.id }) || [];
        }

        return portfolios.map((res) => new Portfolio(res));
    }

    async updatePortfolio(obj) {
        await this.execute(sql.UPDATE, new Portfolio(obj).toDb(), { id: obj.id });
        const [portfolio] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!portfolio) throw new CustomError(404, 'Not found');

        return new Portfolio(portfolio);
    }

    async deletePortfolio(filter) {
        const portfolios = await this.execute(sql.SELECT, null, filter);

        const portfoliosToDeleteId = []
        portfolios.map((p) => portfoliosToDeleteId.push(p.id));

        await projectDAO.deleteProject(`portfolio_id IN (${portfoliosToDeleteId})`);
        return await this.execute(sql.DELETE, null, filter);
    }
}

module.exports = new PortfolioDAO();
