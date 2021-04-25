const json = require('../config/config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserModel = require('../models/UserModel');
const userModel = new UserModel();

const auth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { user, userPassword } = await userModel.findUserBy({ email }, true);
        if (!user) return next({ httpStatusCode: 404 });
        if (!bcrypt.compareSync(password, userPassword)) return next({ httpStatusCode: 401 });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, json.secret, { expiresIn: 86400 });
        res.status(202).json({ user, token });
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const create = async (req, res, next) => {
    try {
        const user = await userModel.createUser(req);
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const find = async (req, res, next) => {
    try {
        const user = await userModel.findUserBy({ id: req.user.id });
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const update = async (req, res, next) => {
    try {
        const user = await userModel.updateUser(req);
        res.status(200).json(user)
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await userModel.deleteUser(req.user.id)
        res.status(200).json(`${result.affectedRows} usuário(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

module.exports = { auth, create, find, update, remove }
