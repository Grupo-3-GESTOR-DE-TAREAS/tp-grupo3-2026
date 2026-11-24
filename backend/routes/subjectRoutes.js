const express = require('express');
const { createSubjectController } = require('../controllers/subjectController');

function createSubjectRoutes(pool) {
    const router = express.Router();
    const controller = createSubjectController(pool);
    router.get('/', controller.list);
    router.post('/', controller.create);
    router.delete('/:id', controller.remove);
    return router;
}

module.exports = { createSubjectRoutes };