function validateTaskPayload(payload, { partial = false } = {}) {
    const errors = {};
    const data = {};

    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { data, errors: { body: 'El cuerpo debe ser un objeto JSON' } };
    }

    if (!partial || Object.hasOwn(payload, 'texto')) {
        if (typeof payload.texto !== 'string' || payload.texto.trim().length < 3) {
            errors.texto = 'La tarea debe tener al menos 3 caracteres';
        } else if (payload.texto.trim().length > 255) {
            errors.texto = 'La tarea no puede superar los 255 caracteres';
        } else {
            data.texto = payload.texto.trim();
        }
    }

    if (Object.hasOwn(payload, 'completada')) {
        if (typeof payload.completada !== 'boolean') {
            errors.completada = 'El estado completada debe ser booleano';
        } else {
            data.completada = payload.completada;
        }
    }

    if (Object.hasOwn(payload, 'materiaId')) {
        const materiaId = payload.materiaId;
        if (materiaId !== null && !/^[1-9]\d*$/.test(String(materiaId))) {
            errors.materiaId = 'La materia indicada no es válida';
        } else {
            data.materiaId = materiaId === null ? null : String(materiaId);
        }
    }

    if (partial && Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
        errors.body = 'Debe indicar al menos un campo para actualizar';
    }

    return { data, errors };
}

function validateSubjectPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return { data: {}, errors: { body: 'El cuerpo debe ser un objeto JSON' } };
    }

    const nombre = typeof payload.nombre === 'string' ? payload.nombre.trim() : '';
    if (nombre.length < 2 || nombre.length > 80) {
        return { data: {}, errors: { nombre: 'El nombre debe tener entre 2 y 80 caracteres' } };
    }

    return { data: { nombre }, errors: {} };
}

module.exports = { validateTaskPayload, validateSubjectPayload };