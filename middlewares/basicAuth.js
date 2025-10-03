import Eventos from '../../models/eventos.js';

const basicAuthMiddleware  = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ code: 'UA', message: 'Authorization header is required1' })
    }
    const [type, credentials] = authHeader.split(' ')
    if (type !== 'Basic') {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported2' })
    }
    if (!credentials) {
        return res.status(401).json({ code: 'UA', message: 'Authorization type is not supported3' })
    }
    const [id] = Buffer.from(credentials, 'base64').toString().split(':')


    if (!id) {
        return res.status(401).json({ code: 'UA', message: 'Id are required' })
    }

    return Eventos.getEventoById(id, (err, evento) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error getting evento by id' })
        }

        if (!evento) {
            return res.status(401).json({ code: 'UA', message: 'id are invalid' })
        }

        if (evento.id !== id) {
            return res.status(401).json({ code: 'UA', message: 'id are invalid' })
        }
        req.evento = evento

        next()
    })
}

export default basicAuthMiddleware;