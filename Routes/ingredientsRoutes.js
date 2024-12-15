// ingredientRoutes.js

const express = require('express');
const router = express.Router();
const ingredientsController = require('../Controllers/ingredientsController');

// Ruter for ingredienser
router.get('/ingredients/getAll', ingredientsController.getAllIngredients); // New route to get all ingredients
router.post('/ingredient/getByName', ingredientsController.getIngredientByName);



module.exports = router;

