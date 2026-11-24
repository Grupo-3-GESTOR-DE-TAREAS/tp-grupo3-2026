require('dotenv').config();
const { createApp } = require('./app');
const { createPool } = require('./config/database');

async function start() {
    const pool = createPool();
    try {
        await pool.query('SELECT 1');
    } catch (error) {
        await pool.end();
        throw new Error(`No se pudo conectar con PostgreSQL: ${error.message}`);
    }

    const app = createApp({ pool });
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log(`Gestor de Tareas disponible en http://localhost:${port}`));
}

start().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});