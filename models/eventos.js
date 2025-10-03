import EventosSchema from '../schemas/eventos.js';

const getAllEventos = (pagination, callback) => {
    return EventosSchema.findAllEventos(pagination, callback);
}

const getEventoById = (id, callback) => {
    return EventosSchema.findEventoById(id, callback);
}

const saveEvento = (evento, callback) => {
    return EventosSchema.saveEvento(evento, callback);
}

const updateEvento = (id, evento, callback) => {
    return EventosSchema.updateEvento(id, evento, callback);
}

const deleteEvento = (id, callback) => {
    return EventosSchema.deleteEvento(id, callback);
}

export default { getAllEventos, getEventoById, saveEvento, updateEvento, deleteEvento }