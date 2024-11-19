// ingredientRoutes.js

const express = require('express');
const router = express.Router();
const ingredientsController = require('../Controllers/ingredientsController');

// Ruter for ingredienser
router.get('/ingredients/getAll', ingredientsController.getAllIngredients); // New route to get all ingredients
router.post('/ingredient/getByName', ingredientsController.getIngredientByName);

// Remove or comment out these if they are no longer needed
// router.post('/ingredient/add', ingredientsController.addIngredient);
// router.put('/ingredient/update', ingredientsController.updateIngredient);
// router.post('/ingredient/check', ingredientsController.checkIngredient); // This can still be used if needed

module.exports = router;

