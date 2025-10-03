import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
dotenv.config();

const SECRETJ = process.env.JWT_SECRET;
const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization || '';

    if (!authorization) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required' });
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
        return res.status(401).json({ code: 'UA', message: 'Type is not supported' });
    }
    if (!token) {
        return res.status(401).json({ code: 'UA', message: 'Token JWT requerido' });
    }


    jwt.verify(token, SECRETJ, (error, evento) => {
        if (error) {
            return res.status(401).json({ code: 'UA', message: 'Type is not supported' });
        }
        req.evento = evento
        next();
    })
};

export default jwtAuthMiddleware;