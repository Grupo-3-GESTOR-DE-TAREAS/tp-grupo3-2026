const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTaskPayload, validateSubjectPayload } = require('../../backend/services/taskValidation');

test('accepts and normalizes a valid task', () => {
    assert.deepEqual(validateTaskPayload({ texto: '  Leer apuntes  ', materiaId: '1001' }), {
        data: { texto: 'Leer apuntes', materiaId: '1001' },
        errors: {}
    });
});

test('rejects empty, short, and oversized task text', () => {
    assert.ok(validateTaskPayload({ texto: '  ' }).errors.texto);
    assert.ok(validateTaskPayload({ texto: 'ab' }).errors.texto);
    assert.ok(validateTaskPayload({ texto: 'x'.repeat(256) }).errors.texto);
});

test('validates partial task updates and completion type', () => {
    assert.ok(validateTaskPayload({}, { partial: true }).errors.body);
    assert.ok(validateTaskPayload({ completada: 'true' }, { partial: true }).errors.completada);
    assert.deepEqual(validateTaskPayload({ completada: true }, { partial: true }), {
        data: { completada: true },
        errors: {}
    });
});

test('accepts unassigned tasks and validates subject names', () => {
    assert.deepEqual(validateTaskPayload({ texto: 'Tarea válida', materiaId: null }).errors, {});
    assert.ok(validateSubjectPayload({ nombre: 'X' }).errors.nombre);
    assert.deepEqual(validateSubjectPayload({ nombre: '  Historia  ' }), {
        data: { nombre: 'Historia' },
        errors: {}
    });
});