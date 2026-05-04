const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', taskController.getAllTasks);
router.get('/my-tasks', authMiddleware.verifyToken, taskController.getMyTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);

router.post(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    taskController.createTask
);

router.delete(
    '/:id',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    taskController.deleteTask
);

module.exports = router;