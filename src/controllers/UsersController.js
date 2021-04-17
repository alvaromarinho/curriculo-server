const { insert, select, update, remove } = require('../models/UsersModel');
const json = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require('path')
const fs = require('fs');

const PATH_DESTINY = path.resolve('./assets/img');

const create = async (req, res) => {
    const data = req.body;

    data.toDb = () => {
        return {
            name: data.name,
            description: data.description,
            email: data.email,
            city: data.city,
            img_url: uploadImage(data.email, req.files),
            uf: data.uf,
            password: bcrypt.hashSync(data.password, bcrypt.genSaltSync())
        }
    }

    insert(data, (result) => {
        select({ id: result.insertId }, (_, user) => {
            return res.status(201).json(user);
        })
    });
}

const uploadImage = (email, file) => {
    try {
        if (!fs.existsSync(`${PATH_DESTINY}/${email}`)){
            fs.mkdirSync(`${PATH_DESTINY}/${email}`);
        }

        const urlImg = `${new Date().getTime()}.png`;
        fs.renameSync(file.img_url.path, `${PATH_DESTINY}/${email}/${urlImg}`);
        return `${email}/${urlImg}`;
    } catch(e) {
        console.log('error_>', e)
        console.log('error saving user image to email :', email);
    }
}

const getImage = (req, res) => {
    const { imageUrl }  = req.query;

    fs.readFile(`${PATH_DESTINY}/${imageUrl}`, (err,content) => {
        if(err){
            console.log(err)
            res.status(400).json(err);
            return;
        }

        res.writeHead(200,{'content-type':'image/png'});
        res.end(content);
    });
}

const auth = (req, res, next) => {
    try {
        const { email, password } = req.body;

        select({ email }, (_, user) => {
            if (!user) throw new Error();

            if (!bcrypt.compareSync(password, user.password)) throw new Error();

            const token = jwt.sign({ 'id': user.id }, json.secret, { expiresIn: 86400 });

            return res.status(202).json({ user, token });
        });

    } catch (e) {
        console.log(e);
        e.httpStatusCode = 403;
        e.responseMessage = 'not authorized!';
        next(e);
    }
}

const read = (req, res, next) => {
    select({ id: req.userId }, (err, result) => {
        if (err || !result) {
            const error = {
                httpStatusCode: 404,
                responseMessage: 'not found!'
            }
            next(error);
        }
        
        res.status(200).json(result)
    });
}

const change = (req, res, next) => {
    try {
        update(req.body, { id: req.userId }, () => {
            select({ id: req.userId }, (_, result) => {
                res.status(200).json(result)
            });
        });
    } catch (e) {
        next(e);
    }
}

const remover = (req, res, next) => {
    try {
        remove({ id: req.userId }, () => {
            res.status(200).json('ok')
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    create,
    read,
    getImage,
    auth,
    change,
    remover
}