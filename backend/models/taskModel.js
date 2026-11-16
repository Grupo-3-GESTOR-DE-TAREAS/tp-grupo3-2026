const taskColumns = `
    t.id,
    t.texto,
    t.completada,
    t.materia_id AS "materiaId",
    t.fecha_creacion AS "fechaCreacion"
`;

async function findAll(pool) {
    const result = await pool.query(`
        SELECT ${taskColumns}
        FROM tareas t
        ORDER BY t.fecha_creacion DESC, t.id DESC
    `);
    return result.rows;
}

async function create(pool, task) {
    const result = await pool.query(`
        INSERT INTO tareas (texto, completada, materia_id)
        VALUES ($1, $2, $3)
        RETURNING id, texto, completada, materia_id AS "materiaId", fecha_creacion AS "fechaCreacion"
    `, [task.texto, task.completada, task.materiaId]);
    return result.rows[0];
}

async function update(pool, id, task) {
    const columns = { texto: 'texto', completada: 'completada', materiaId: 'materia_id' };
    const entries = Object.entries(task);
    const assignments = entries.map(([key], index) => `${columns[key]} = $${index + 1}`);
    const values = entries.map(([, value]) => value);
    values.push(id);

    const result = await pool.query(`
        UPDATE tareas
        SET ${assignments.join(', ')}, actualizada_en = CURRENT_TIMESTAMP
        WHERE id = $${values.length}
        RETURNING id, texto, completada, materia_id AS "materiaId", fecha_creacion AS "fechaCreacion"
    `, values);
    return result.rows[0] || null;
}

async function remove(pool, id) {
    const result = await pool.query('DELETE FROM tareas WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
}

module.exports = { findAll, create, update, remove };