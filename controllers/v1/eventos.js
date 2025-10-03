import { Router } from "express";
import { param, query, validationResult, body   } from "express-validator";
import Eventos from '../../models/eventos.js';

const router = Router();



let eventos = [];

const validateCreateEvento = [
    body('id')
        .isString().withMessage('El campo "id" debe ser una cadena de texto')
        .notEmpty().withMessage('El campo "id" es obligatorio')
        .trim(),

    body('name')
        .isString().withMessage('El campo "name" debe ser una cadena de texto')
        .notEmpty().withMessage('El campo "name" es obligatorio')
        .trim()
        .isLength({ min: 1, max: 20 }).withMessage('El campo "name" debe tener entre 1 y 20 caracteres'),

    body('description')
        .optional({ nullable: true, checkFalsy: true })
        .isString().withMessage('El campo "description" debe ser una cadena de texto')
        .trim()
        .isLength({ max: 100 }).withMessage('El campo "description" no puede exceder los 100 caracteres'),

    body('amount')
        .isNumeric().withMessage('El campo "amount" debe ser un número')
        .toFloat()
        .isFloat({ min: 0 }).withMessage('El campo "amount" debe ser mayor o igual a 0'),

    body('date')
        .isISO8601().withMessage('El campo "date" debe tener formato ISO 8601 (ej: "2025-04-01T10:00:00Z")')
        .custom(value => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('Fecha inválida');
            }
            return true;
        }),

    body('type')
        .isIn(['Egreso', 'Ingreso']).withMessage('El campo "type" debe ser "Egreso" o "Ingreso"')
];


router.post('/', validateCreateEvento, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 'ER_VALIDATION',
            message: 'Errores en los datos enviados',
            errors: errors.array()
        });
    }
    const { id, name, description, amount, date, type } = req.body
    const newEvento = { id, name, description, amount, date, type }
    return Eventos.saveEvento(newEvento, (err, evento) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error creando evento!' });
        }
        res.json({ code: 'OK', message: 'Evento creado excitosamente!', data: { evento } });
    });
})

router.get('/', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    return Eventos.getAllEventos({ page, limit }, (err, eventos) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error obteniendo eventos!' });
        }
        res.json({ code: 'OK', message: 'Eventos disponibles!', data: { eventos } });
    });
})


router.get('/query/', query('id').notEmpty(), (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 'PF', message: 'El ID de evento es requerido!' });
    }
    const id = req.query.id
    return Eventos.getEventoById(id, (err, evento) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error obteniendo evento!' });
        }
        if (!evento) {
            return res.status(404).json({ code: 'NF', message: 'Evento no encontrado!' });
        }
        res.json({ code: 'OK', message: 'Evento disponible!', data: { evento } });
    });
})

router.put('/:id', param('id').isString().notEmpty(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 'PF', message: 'El ID de evento es requerido!' });
    }
    const { id } = req.params
    const { name, description, amount, date, type } = req.body
    const evento = { name, description, amount, date, type }

    return Eventos.updateEvento(id, evento, (err, eventoActualizado) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error actualizando evento!' });
        }
        if (!eventoActualizado) {
            return res.status(404).json({ code: 'NF', message: 'Evento no encontrado!' });
        }
        res.json({ code: 'OK', message: 'Evento actualizado!', data: { evento } });
    });

})

router.delete('/:id', param('id').isString().notEmpty(), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ code: 'PF', message: 'El ID de evento es requerido!' });
    }
    const { id } = req.params
    return Eventos.deleteEvento(id, (err, evento) => {
        if (err) {
            return res.status(500).json({ code: 'ER', message: 'Error eliminando evento!' });
        }
        if (!evento) {
            return res.status(404).json({ code: 'NF', message: 'Evento no encontrado!' });
        }
        res.json({ code: 'OK', message: 'Evento eliminado!', data: { evento } });
    });
})
export default router;