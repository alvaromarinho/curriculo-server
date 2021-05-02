import jwt from 'jsonwebtoken';
import { CustomError } from '../models/CustomError.js';

export default (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next(new CustomError(400, 'authorization header not found'));

        const splitedToken = authHeader.split(' ');
        if (splitedToken.length !== 2) return next(new CustomError(400, 'wrong authorization header'));

        const [schema, token] = splitedToken;
        if (schema !== 'Bearer') return next(new CustomError(400, 'authorization header not allowed'));

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new CustomError(401, err.message));
            req.user = { id: decoded.id, email: decoded.email }
            return next();
        });
    } catch (error) {
        next(new CustomError(401, 'Invalid Token'))
    }
}