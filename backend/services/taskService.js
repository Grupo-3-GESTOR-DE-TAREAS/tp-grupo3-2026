const taskModel = require('../models/taskModel');
const { validateTaskPayload } = require('./taskValidation');

function invalidPayload(errors) {
    const error = new Error('Datos de tarea inválidos');
    error.status = 400;
    error.details = errors;
    return error;
}

async function list(pool) {
    return taskModel.findAll(pool);
}

async function create(pool, payload) {
    const { data, errors } = validateTaskPayload(payload);
    if (Object.keys(errors).length) throw invalidPayload(errors);
    return taskModel.create(pool, {
        ...data,
        completada: data.completada ?? false,
        materiaId: data.materiaId ?? null
    });
}

async function update(pool, id, payload) {
    const { data, errors } = validateTaskPayload(payload, { partial: true });
    if (Object.keys(errors).length) throw invalidPayload(errors);
    return taskModel.update(pool, id, data);
}

async function remove(pool, id) {
    return taskModel.remove(pool, id);
}

module.exports = { list, create, update, remove };