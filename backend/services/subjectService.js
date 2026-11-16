const subjectModel = require('../models/subjectModel');
const { validateSubjectPayload } = require('./taskValidation');

async function list(pool) {
    return subjectModel.findAll(pool);
}

async function create(pool, payload) {
    const { data, errors } = validateSubjectPayload(payload);
    if (Object.keys(errors).length) {
        const error = new Error('Datos de materia inválidos');
        error.status = 400;
        error.details = errors;
        throw error;
    }
    return subjectModel.create(pool, data.nombre);
}

async function remove(pool, id) {
    return subjectModel.remove(pool, id);
}

module.exports = { list, create, remove };