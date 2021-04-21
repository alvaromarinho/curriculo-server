const query = require('../models/genericModel');

const TABLE = 'phones';

const createPhone = async (req, res, next) => {
    try {
        req.body.user_id = req.userId;
        const result = await query('INSERT', TABLE, req.body);
        const phone = await query('SELECT', TABLE, null, { id: result.insertId });
        delete phone.user_id;
        return req.innerRequest ? phone : res.status(201).json(phone);
    } catch (error) {
        if (req.innerRequest) throw error
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const findPhoneByUser = async (req, res, next) => {
    try {
        const phones = await query('SELECT', TABLE, null, { user_id: req.userId }) || [];
        if(phones.length)
            phones.map((p) => delete p.user_id);
        return req.innerRequest ? phones : res.status(200).json(phones);
    } catch (error) {
        if (req.innerRequest) throw error
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

const deletePhone = async (req, res, next) => {
    try {
        const response = await query('DELETE', TABLE, null, req.body);
        return req.innerRequest ? response.affectedRows : res.status(200).json(`${response.affectedRows} telefone(s) deletado(s)`);
    } catch (error) {
        if (req.innerRequest) throw error
        next({ httpStatusCode: 400, responseMessage: error.sqlMessage || error })
    }
}

module.exports = { createPhone, findPhoneByUser, deletePhone }
