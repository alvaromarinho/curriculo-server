import jwt from 'jsonwebtoken';
import userDAO from '../dao/UserDAO.js';
import { compareSync } from 'bcrypt';
import { CustomError } from '../models/CustomError.js';

const auth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, userPassword } = await userDAO.findBy({ email }, true);
        if (!user) return next({ httpStatusCode: 404 });
        if (!compareSync(password, userPassword)) return next({ httpStatusCode: 401 });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: 86400 });
        res.status(202).json({ user, token });
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error authenticating user'))
    }
}

const create = async (req, res, next) => {
    try {
        const user = await userDAO.create(req);
        res.status(200).json(user)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error creating user'))
    }
}

const find = async (req, res, next) => {
    try {
        const user = await userDAO.findBy({ id: req.user.id });
        res.status(200).json(user)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error finding user'))
    }
}

const findAllData = async (req, res, next) => {
    try {
        const user = await userDAO.findBy({ id: req.params.userId });
        user.informations = 'teste'
        res.status(200).json(user)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error finding user'))
    }
}

const update = async (req, res, next) => {
    try {
        const user = await userDAO.update(req);
        res.status(200).json(user)
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error updating user'))
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await userDAO.deleteById(req.user.id)
        res.status(200).json(`Usuário #${result.affectedRows} deletado`);
    } catch (error) {
        next(new CustomError(error.httpStatusCode || 400, error.message || 'Error deleting user'))
    }
}

export default { auth, create, find, findAllData, update, remove }