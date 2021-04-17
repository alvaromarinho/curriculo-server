const { insert, select } = require('../models/UsersModel');
const json = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const create = async (req, res) => {
    const data = req.body;

    data.toDb = () => {
        return {
            name: data.name,
            description: data.description,
            email: data.email,
            img_url: data.imageUrl,
            city: data.city,
            uf: data.uf,
            password: bcrypt.hashSync(data.password, bcrypt.genSaltSync())
        }
    }

    insert(data, (result) => {
        select({ id: result.insertId }, (user) => {
            return res.status(201).json(user);
        })
    });
}

const auth = (req, res, next) => {
    try {
        const { email, password } = req.body;

        select({ email }, (user) => {
            if(!user) throw new Error(); 

            if(!bcrypt.compareSync(password, user.password)) throw new Error();

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
    try {
        const { id } = req.params;

        select({ id }, (result) => {
            res.status(200).json(result)
        });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    create,
    read,
    auth
}