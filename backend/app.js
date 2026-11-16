const path = require('node:path');
const express = require('express');
const { createTaskRoutes } = require('./routes/taskRoutes');
const { createSubjectRoutes } = require('./routes/subjectRoutes');

function createApp({ pool }) {
    const app = express();
    app.disable('x-powered-by');
    app.use(express.json({ limit: '16kb' }));

    app.get('/api/health', async (req, res, next) => {
        try {
            await pool.query('SELECT 1');
            res.json({ status: 'ok', database: 'connected' });
        } catch (error) {
            next(error);
        }
    });
    app.use('/api/tareas', createTaskRoutes(pool));
    app.use('/api/materias', createSubjectRoutes(pool));

    app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta de API no encontrada' }));
    app.use(express.static(path.resolve(__dirname, '../frontend')));
    app.use((error, req, res, next) => {
        if (res.headersSent) return next(error);

        if (error.type === 'entity.parse.failed') {
            return res.status(400).json({ error: 'El cuerpo JSON no es válido' });
        }
        if (error.status === 400) {
            return res.status(400).json({ error: error.message, details: error.details });
        }
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Ya existe una tarea o materia con esos datos' });
        }
        if (error.code === '23503') {
            return res.status(400).json({ error: 'La materia indicada no existe' });
        }
        if (error.code === '22P02') {
            return res.status(400).json({ error: 'El identificador no es válido' });
        }

        console.error(error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    });

    return app;
}

module.exports = { createApp };