const taskService = require('../services/taskService');

function createTaskController(pool) {
    return {
        list: async (req, res) => res.json(await taskService.list(pool)),
        create: async (req, res) => res.status(201).json(await taskService.create(pool, req.body)),
        update: async (req, res) => {
            const task = await taskService.update(pool, req.params.id, req.body);
            if (!task) return res.status(404).json({ error: 'La tarea no existe' });
            return res.json(task);
        },
        remove: async (req, res) => {
            const removed = await taskService.remove(pool, req.params.id);
            if (!removed) return res.status(404).json({ error: 'La tarea no existe' });
            return res.status(204).end();
        }
    };
}

module.exports = { createTaskController };