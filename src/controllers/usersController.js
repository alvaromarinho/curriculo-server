const { insert, select, update, remove } = require('../models/genericModel');
const json = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path')
const fs = require('fs');

const TABLE = 'users';
const PATH_DESTINY = path.resolve('./assets/img');

const auth = (req, res, next) => {
    const { email, password } = req.body;

    select('users', { email }, (err, user) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });
        if (!user) return next({ httpStatusCode: 404 });
        if (!bcrypt.compareSync(password, user.password)) return next({ httpStatusCode: 401 });

        const token = jwt.sign({ 'id': user.id }, json.secret, { expiresIn: 86400 });
        delete user.password;

        return res.status(202).json({ user, token });
    });
}

const createUser = (req, res, next) => {
    req.body.img_url = uploadImage(req.body.email, req.files);
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());

    insert(TABLE, req.body, (err, result) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });

        select(TABLE, { id: result.insertId }, (err, user) => {
            if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });
            delete user.password;
            res.status(201).json(user);
        })
    });
}

const findUser = (req, res, next) => {
    select(TABLE, { id: req.userId }, (err, user) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });
        delete user.password;
        res.status(200).json(user);
    });
}

const updateUser = (req, res, next) => {
    const data = req.body;

    if (req.files) data.img_url = uploadImage(data.email, req.files);
    if (data.password) data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());

    update(TABLE, data, { id: req.userId }, (err) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });

        select(TABLE, { id: req.userId }, (err, user) => {
            if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });
            delete user.password;
            res.status(200).json(user);
        });
    });
}

const deleteUser = (req, res) => {
    remove(TABLE, { id: req.userId }, (err) => {
        if (err) return next({ httpStatusCode: 400, responseMessage: err.sqlMessage });
        res.status(200);
    });
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
    console.log(file)
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
