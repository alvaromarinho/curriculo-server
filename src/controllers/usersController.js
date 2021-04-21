const query = require('../models/genericModel');

const { createPhone, findPhoneByUser, deletePhone } = require('./phonesController');
const json = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path')
const fs = require('fs');

const TABLE = 'users';
const PATH_DESTINY = path.resolve('./assets/img');

const auth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await query('SELECT', TABLE, null, { email });

        if (!user) return next({ httpStatusCode: 404 });
        if (!bcrypt.compareSync(password, user.password)) return next({ httpStatusCode: 401 });

        const token = jwt.sign({ 'id': user.id }, json.secret, { expiresIn: 86400 });
        delete user.password;
        res.status(202).json({ user, token });
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const createUser = async (req, res, next) => {
    try {
        req.body.img_url = uploadImage(req.body.email, req.files);
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());

        const phones = req.body.phones || [];
        delete req.body.phones

        const result = await query('INSERT', TABLE, req.body);
        const user = await query('SELECT', TABLE, null, { id: result.insertId });
        user.phones = [];

        for (const phone of phones) {
            user.phones.push(await createPhone({ body: { number: phone }, userId: result.insertId, innerRequest: true }, null, next));
        }

        delete user.password;
        res.status(201).json(user);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const findUser = async (req, res, next) => {
    try {
        const user = await query('SELECT', TABLE, null, { id: req.userId });
        if (user) {
            delete user.password;
            user.phones = await findPhoneByUser({ userId: req.userId, innerRequest: true }, null, next) || [];
        }
        res.status(200).json(user);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const updateUser = async (req, res, next) => {
    try {
        if (req.body.phones) {
            const toNotDelete = []
            req.body.phones.filter((phone) => phone.id).map((phone) => toNotDelete.push(phone.id.toString()));
            await deletePhone({ body: { toSqlString: () => `id NOT IN (${toNotDelete})` }, innerRequest: true }, null, next);

            const toAdd = req.body.phones.filter((phone) => !phone.id);
            for (const phone of toAdd) {
                await createPhone({ body: { number: phone.number }, userId: req.userId, innerRequest: true }, null, next);
            }

            delete req.body.phones;
        }

        if (req.files) req.body.img_url = uploadImage(req.body.email, req.files);
        if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());

        await query('UPDATE', TABLE, req.body, { id: req.userId });
        const user = await query('SELECT', TABLE, null, { id: req.userId });
        delete user.password;
        user.phones = await findPhoneByUser({ userId: req.userId, innerRequest: true }, null, next) || [];
        res.status(200).json(user);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const deleteUser = async (req, res, next) => {
    try {
        await deletePhone({ body: { user_id: req.userId }, innerRequest: true }, null, next);
        const response = await query('DELETE', TABLE, null, { id: req.userId });
        res.status(200).json(`${response.affectedRows} usuário(s) deletado(s)`);
    } catch (error) {
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const getImage = (req, res) => {
    const { imageUrl } = req.query;

    fs.readFile(`${PATH_DESTINY}/${imageUrl}`, (err, content) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err });
        res.writeHead(200, { 'content-type': 'image/png' });
        res.end(content);
    });
}

const uploadImage = (email, file) => {
    try {
        if (!fs.existsSync(`${PATH_DESTINY}/${email}`)) {
            fs.mkdirSync(`${PATH_DESTINY}/${email}`);
        }
        if (file.img_url) {
            const img = Array.isArray(file.img_url) ? file.img_url[0] : file.img_url
            const urlImg = `${new Date().getTime()}.png`;
            fs.renameSync(img.path, `${PATH_DESTINY}/${email}/${urlImg}`);
            return `${email}/${urlImg}`;
        }
    } catch (e) {
        console.log('[error] upload image from user:', email)
        console.log(e);
    }
}

module.exports = { auth, createUser, findUser, updateUser, deleteUser, getImage, uploadImage }
