const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, categoryController.getAllCategories);
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyAdmin, categoryController.createCategory);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyAdmin, categoryController.deleteCategory);

module.exports = router;