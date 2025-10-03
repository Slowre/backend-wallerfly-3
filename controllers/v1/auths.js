import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();



import basicAuthMiddleware from '../../middlewares/basicAuth.js';

const SECRETJ = process.env.JWT_SECRET;
const router = Router();

router.get('/token', basicAuthMiddleware, (req, res) => {
    jwt.sign({ evento: req.evento }, SECRETJ, { expiresIn: '1h' }, (err, token) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: `Error generating token!` })
        }
        res.json({ code: 'OK', message: 'Token generated successfully~', data: { token } })

    })

})

export default router;