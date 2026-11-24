const { Pool } = require('pg');

function createPool() {
    if (!process.env.DATABASE_URL) {
        throw new Error('Falta configurar DATABASE_URL en el entorno');
    }

    return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 10
    });
}

module.exports = { createPool };