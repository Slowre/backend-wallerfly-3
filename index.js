import express from 'express'

import session from 'express-session';
import eventosV1 from './controllers/v1/eventos.js';
import authsV1 from './controllers/v1/auths.js';
import mongoose from './db.js';

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    if (req.body) {
        console.log(`${JSON.stringify(req.body, null, 2)}`)
    }
    next()
})

const PORT = 3030

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 8 * 60 * 60 * 100,
        secure: false
    }
}))

app.use('/api/v1/auths', authsV1);
app.use('/api/v1/eventos', eventosV1);


app.get("/health", (req, res) => {
    const estadoConexion = mongoose.connection.readyState

    let dbEstado = 'desconocido';
    switch (estadoConexion) {
        case 0:
            dbEstado = 'desconectado';
            break;
        case 1:
            dbEstado = 'conectado';
            break;
        case 2:
            dbEstado = 'conectando';
            break;
        case 3:
            dbEstado = 'desconectando';
            break;
    }

    res.json({ code: 'OK', message: 'Server is running', time: process.uptime(), estado: dbEstado })

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})