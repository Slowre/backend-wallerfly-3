import jwtAuthMiddleware from "./jwtAuth"

return module.exports = (req, res, next) => {

    if (req.headers.authorization) {
        return jwtAuthMiddleware(req, res, next)
    }
    const evento = req.session.evento
    if (!evento) {
        return res.status(401).json({ code: 'UA', message: 'Evento not logged in!' })
    }
    req.evento = evento
    next()
}