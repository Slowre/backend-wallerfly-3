import mongoose from 'mongoose'
import logger from '../utils/logger.js';
const types = ['Egreso', 'Ingreso']
const eventoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 20,
        minLength: 1
    },
    description: {
        type: String,
        trim: true,
        maxLength: 100,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    date: { type: Date, required: true },
    type: { type: String, enum: types }
});

const Evento = mongoose.model('Evento', eventoSchema)



const saveEvento = (evento, callback) => {
    const { id, name, description, amount, date, type } = evento
    const newEvento = new Evento({ id, name, description, amount, date, type })
    newEvento.save()
        .then(() => {
            logger.info("Nuevo evento creado!")
            return callback(null, newEvento);
        })
        .catch(err => {
            logger.error(`Error al crear evento con ID ${id}: ${err.message}`)
            return callback(err);
        });
}

const findAllEventos = (pagination, callback) => {
    const { page, limit } = pagination
    Evento.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .then(results => {
            logger.info(`Se encontraron ${results.length} eventos (página ${page}, límite ${limit})`,results);
            return callback(null, results);
        })
        .catch(err => {
            logger.error(`Error al obtener eventos: ${err.message}`,err);
            return callback(err);
        });
}

const findEventoById = (id, callback) => {
    Evento.findOne({ id })
        .then(result => {
            if (result) {
                logger.info(`Evento encontrado con ID: ${id}`,result);
            } else {
                logger.warn(`Evento con ID "${id}" no encontrado`);
            }
            return callback(null, result);
        })
        .catch(err => {
            logger.error(`Error al buscar evento con ID ${id}: ${err.message}`,err);
            return callback(err);
        });
}

const updateEvento = (id, evento, callback) => {
    Evento.findOneAndUpdate({ id }, evento, { new: true })
        .then(result => {
            if (result) {
                logger.info(`Evento actualizado con ID: ${id}`,result);
            } else {
                logger.warn(`Evento inexistente con ID: ${id}`);
            }
            return callback(null, result);
        })
        .catch(err => {
            logger.error(`Error al actualizar evento con ID ${id}: ${err.message}`,err);
            return callback(err);
        });
}

const deleteEvento = (id, callback) => {
    Evento.findOneAndDelete({ id })
        .then(result => {
            if (result) {
                logger.info(`Evento eliminado con ID: ${id}`,result);
            } else {
                logger.warn(`Evento inexistente con ID: ${id}`);
            }
            return callback(null, result);
        })
        .catch(err => {
            logger.error(`Error al eliminar evento con ID ${id}: ${err.message}`,err);
            return callback(err);
        });
};

export default { Evento, saveEvento, findAllEventos, findEventoById, updateEvento, deleteEvento }
