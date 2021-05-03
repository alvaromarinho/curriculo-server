const projectDAO = require('../dao/ProjectDAO');
const CustomError = require('../models/CustomError');

const create = async (req, res, next) => {
    try {
        const project = await projectDAO.create(req);
        res.status(200).json(project)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error creating project'))
    }
}

const find = async (req, res, next) => {
    try {
        const project = await projectDAO.findBy({ id: req.params.projectId });
        res.status(200).json(project)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error finding project'))
    }
}

const update = async (req, res, next) => {
    try {
        const project = await projectDAO.update({ ...req.body, id: req.params.projectId });
        res.status(200).json(project)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error updating project'))
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await projectDAO.remove({ id: req.params.projectId })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error deleting project'))
    }
}

module.exports = { create, find, update, remove }