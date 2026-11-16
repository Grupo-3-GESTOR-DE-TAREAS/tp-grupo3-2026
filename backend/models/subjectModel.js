async function findAll(pool) {
    const result = await pool.query(`
        SELECT id, nombre, icono, color_class AS "colorClass", color
        FROM materias
        ORDER BY id
    `);
    return result.rows;
}

async function create(pool, nombre) {
    const result = await pool.query(`
        INSERT INTO materias (nombre)
        VALUES ($1)
        RETURNING id, nombre, icono, color_class AS "colorClass", color
    `, [nombre]);
    return result.rows[0];
}

async function remove(pool, id) {
    const result = await pool.query('DELETE FROM materias WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
}

module.exports = { findAll, create, remove };