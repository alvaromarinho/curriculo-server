const InformationModel = require('../models/InformationModel');
const informationModel = new InformationModel();

const create = async (req, res, next) => {
    try {
        const information = await informationModel.createInformation(req);
        res.status(200).json(information)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const find = async (req, res, next) => {
    try {
        const information = await informationModel.findInformationsBy({ user_id: req.user.id });
        res.status(200).json(information)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const update = async (req, res, next) => {
    try {
        const information = await informationModel.updateInformation({ ...req.body, id: req.params.informationId });
        res.status(200).json(information)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const remove = async (req, res, next) => {
    try {
        // checa se é do usuário?
        const result = await informationModel.deleteInformation({ id: req.params.informationId })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const resourceOwner = async (req, res, next) => {
    const information = await informationModel.findInformationsBy({ id: req.params.informationId });
    if (req.user.id !== information.userId) 
        return next({ httpStatusCode: 403 });
    return next();
}

module.exports = { create, find, update, remove, resourceOwner }
