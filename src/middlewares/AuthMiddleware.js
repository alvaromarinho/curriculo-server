const jwt = require("jsonwebtoken");
const json = require("../config/config.json");
const CustomError = require('../models/CustomError');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next({ httpStatusCode: 400, responseMessage: 'authorization header not found' });

        const splitedToken = authHeader.split(' ');
        if (splitedToken.length !== 2) return next({ httpStatusCode: 400, responseMessage: 'wrong authorization header' });

        const [schema, token] = splitedToken;
        if (schema !== 'Bearer') return next({ httpStatusCode: 400, responseMessage: 'authorization header not allowed' });

        jwt.verify(token, json.secret, (err, decoded) => {
            if (err) return next({ httpStatusCode: 401, responseMessage: err.message });
            req.user = { id: decoded.id, email: decoded.email }
            return next();
        });
    } catch (error) {
        console.log(error);
        next(new CustomError(401, 'Invalid Token'))
    }
}