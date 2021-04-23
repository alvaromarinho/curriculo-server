const InformationModel = require('../models/InformationModel');
const informationModel = new InformationModel();

const createInformation = async (req, res, next) => {
    try {
        const information = await informationModel.createInformation(req);
        res.status(200).json(information)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const findInformations = async (req, res, next) => {
    try {
        const user = await informationModel.findInformationsBy({ user_id: req.userId });
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const findInformationsByType = async (req, res, next) => {
    try {
        const user = await informationModel.findInformationsBy({ user_id: req.userId, type: req.params.type.toUpperCase() });
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const updateInformation = async (req, res, next) => {
    try {
        const user = await informationModel.updateInformation({ ...req.body, id: req.params.id });
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const deleteInformation = async (req, res, next) => {
    try {
        const result = await informationModel.deleteInformation({ id: req.params.id })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

module.exports = { createInformation, findInformations, findInformationsByType, updateInformation, deleteInformation }
