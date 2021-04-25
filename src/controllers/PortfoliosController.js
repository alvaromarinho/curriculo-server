const portfolioDAO = require('../dao/PortfolioDAO');
const CustomError = require('../models/CustomError');

const create = async (req, res, next) => {
    try {
        const portfolio = await portfolioDAO.createPortfolio(req);
        res.status(200).json(portfolio)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error creating portfolio'))
    }
}

const find = async (req, res, next) => {
    try {
        const portfolio = await portfolioDAO.findPortfoliosBy({ user_id: req.user.id });
        res.status(200).json(portfolio)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error finding portfolio'))
    }
}

const update = async (req, res, next) => {
    try {
        const portfolio = await portfolioDAO.updatePortfolio({ ...req.body, id: req.params.portfolioId });
        res.status(200).json(portfolio)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error updating portfolio'))
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await portfolioDAO.deletePortfolio(req.params.portfolioId)
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error deleting portfolio'))
    }
}

const resourceOwner = async (req, res, next) => {
    const [portfolio] = await portfolioDAO.findPortfoliosBy({ id: req.params.portfolioId });
    if (req.user.id !== portfolio.userId) 
        return next({ httpStatusCode: 403 });
    return next();
}

module.exports = { create, find, update, remove, resourceOwner }
