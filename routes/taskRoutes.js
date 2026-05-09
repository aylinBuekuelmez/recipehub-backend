const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

router.get(
    '/',
    authMiddleware.verifyToken,
    authMiddleware.verifyAdmin,
    taskController.getAllTasks
);
router.get('/my-tasks',
    authMiddleware.verifyToken,
    taskController.getMyTasks);
router.get(
    '/:id',
    authMiddleware.verifyToken,
    taskController.getTaskById
);
router.put(
    '/:id',
    authMiddleware.verifyToken,
    taskController.updateTask
);

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