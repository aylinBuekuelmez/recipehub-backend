const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, recipeController.getAllRecipes);
router.get('/:id', authMiddleware.verifyToken, recipeController.getRecipeById);
router.post('/', authMiddleware.verifyToken, recipeController.createRecipe);
router.put('/:id', authMiddleware.verifyToken, recipeController.updateRecipe);
router.delete('/:id', authMiddleware.verifyToken, recipeController.deleteRecipe);

module.exports = router;