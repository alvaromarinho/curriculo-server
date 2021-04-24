const PortfolioModel = require('../models/PortfolioModel');
const portfolioModel = new PortfolioModel();

const create = async (req, res, next) => {
    try {
        const portfolio = await portfolioModel.createPortfolio(req);
        res.status(200).json(portfolio)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const find = async (req, res, next) => {
    try {
        const portfolio = await portfolioModel.findPortfoliosBy({ user_id: req.userId });
        res.status(200).json(portfolio)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const update = async (req, res, next) => {
    try {
        const portfolio = await portfolioModel.updatePortfolio({ ...req.body, id: req.params.id });
        res.status(200).json(portfolio)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await portfolioModel.deletePortfolio({ id: req.params.id })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

module.exports = { create, find, update, remove }
