const subjectService = require('../services/subjectService');

function createSubjectController(pool) {
    return {
        list: async (req, res) => res.json(await subjectService.list(pool)),
        create: async (req, res) => res.status(201).json(await subjectService.create(pool, req.body)),
        remove: async (req, res) => {
            const removed = await subjectService.remove(pool, req.params.id);
            if (!removed) return res.status(404).json({ error: 'La materia no existe' });
            return res.status(204).end();
        }
    };
}

module.exports = { createSubjectController };