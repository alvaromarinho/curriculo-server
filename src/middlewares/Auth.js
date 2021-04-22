const jwt = require("jsonwebtoken");
const json = require("../config/config.json");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) return next({ httpStatusCode: 400, responseMessage: 'authorization header not found' });

        const splitedToken = authHeader.split(' ');
        if(splitedToken.length !== 2) return next({ httpStatusCode: 400, responseMessage: 'wrong authorization header' });

        const [schema, token] = splitedToken;
        if(schema !== 'Bearer') return next({ httpStatusCode: 400, responseMessage: 'authorization header not allowed' });

        jwt.verify(token, json.secret, (err, decoded) => {
            if (err) return next({ httpStatusCode: 401, responseMessage: err.message });

            req.userId = decoded.id;
            return next();
        });
    } catch (e) {
        console.log(e);
        e.httpStatusCode = 401;
        e.responseMessage = 'Invalid Token!';
        next(e);
    }
}