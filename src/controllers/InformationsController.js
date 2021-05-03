const informationDAO = require('../dao/InformationDAO');
const CustomError = require('../models/CustomError');

const create = async (req, res, next) => {
    try {
        const information = await informationDAO.create(req);
        res.status(200).json(information)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error creating information'))
    }
}

const find = async (req, res, next) => {
    try {
        const information = await informationDAO.findBy({ user_id: req.user.id });
        res.status(200).json(information)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error finding information'))
    }
}

const update = async (req, res, next) => {
    try {
        const information = await informationDAO.update({ ...req.body, id: req.params.informationId });
        res.status(200).json(information)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error updating information'))
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await informationDAO.remove({ id: req.params.informationId })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error deleting information'))
    }
}

const resourceOwner = async (req, res, next) => {
    const [information] = await informationDAO.findBy({ id: req.params.informationId });
    if (req.user.id !== information.userId)
        return next({ httpStatusCode: 403 });
    return next();
}

module.exports = { create, find, update, remove, resourceOwner }