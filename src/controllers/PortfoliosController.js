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
        const portfolio = await portfolioModel.findPortfoliosBy({ user_id: req.user.id });
        res.status(200).json(portfolio)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const update = async (req, res, next) => {
    try {
        const portfolio = await portfolioModel.updatePortfolio({ ...req.body, id: req.params.portfolioId });
        res.status(200).json(portfolio)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await portfolioModel.deletePortfolio(req.params.portfolioId)
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const resourceOwner = async (req, res, next) => {
    const portfolio = await portfolioModel.findPortfoliosBy({ id: req.params.portfolioId });
    if (req.user.id !== portfolio.userId) 
        return next({ httpStatusCode: 403 });
    return next();
}

module.exports = { create, find, update, remove, resourceOwner }
