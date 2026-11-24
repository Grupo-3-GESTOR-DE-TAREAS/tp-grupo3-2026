const express = require('express');
const { createTaskController } = require('../controllers/taskController');

function createTaskRoutes(pool) {
    const router = express.Router();
    const controller = createTaskController(pool);
    router.get('/', controller.list);
    router.post('/', controller.create);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.remove);
    return router;
}

module.exports = { createTaskRoutes };