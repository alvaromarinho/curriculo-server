import { DAO, sql } from './DAO.js';
import { Portfolio } from '../models/Portfolio.js';
import { CustomError } from '../models/CustomError.js';
import projectDAO from './ProjectDAO.js';

class PortfolioDAO extends DAO {

    constructor() {
        super('portfolios');
    }

    async create(req) {
        const result = await this.execute(sql.INSERT, new Portfolio(req.body).toDb(req.user.id));
        const [portfolio] = await this.execute(sql.SELECT, null, { id: result.insertId });
        if (!portfolio) throw new CustomError(404, 'Error creating porfolio');

        return new Portfolio(portfolio);
    }

    async findBy(filter) {
        const portfolios = await this.execute(sql.SELECT, null, filter);
        if (!portfolios) throw new CustomError(404, 'Not found');

        for (const portfolio of portfolios) {
            portfolio.projects = await projectDAO.findBy({ portfolio_id: portfolio.id }) || [];
        }

        return portfolios.map((res) => new Portfolio(res));
    }

    async update(obj) {
        await this.execute(sql.UPDATE, new Portfolio(obj).toDb(), { id: obj.id });
        const [portfolio] = await this.execute(sql.SELECT, null, { id: obj.id });
        if (!portfolio) throw new CustomError(404, 'Not found');

        return new Portfolio(portfolio);
    }

    async remove(filter) {
        const portfolios = await this.execute(sql.SELECT, null, filter);

        const portfoliosToDeleteId = []
        portfolios.map((p) => portfoliosToDeleteId.push(p.id));

        await projectDAO.remove(`portfolio_id IN (${portfoliosToDeleteId})`);
        return await this.execute(sql.DELETE, null, filter);
    }
}

export default new PortfolioDAO();