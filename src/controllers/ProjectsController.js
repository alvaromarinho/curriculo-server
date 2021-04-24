const ProjectModel = require('../models/ProjectModel');
const PortfolioModel = require('../models/PortfolioModel');

const projectModel = new ProjectModel();
const portfolioModel = new PortfolioModel();

const create = async (req, res, next) => {
    try {
        const project = await projectModel.createProject({ ...req.body, portfolioId: req.params.portfolioId });
        res.status(200).json(project)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const find = async (req, res, next) => {
    try {
        const project = await projectModel.findProjectsBy({ id: req.params.projectId });
        res.status(200).json(project)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const update = async (req, res, next) => {
    try {
        const project = await projectModel.updateProject({ ...req.body, id: req.params.projectId });
        res.status(200).json(project)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await projectModel.deleteProject({ id: req.params.projectId })
        res.status(200).json(`${result.affectedRows} registro(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

module.exports = { create, find, update, remove }
