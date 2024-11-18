const express = require('express');
const router = express.Router();
const ingredientsController = require('../Controllers/ingredientsController');

// Ruter for ingredienser
router.post('/ingredient/add', ingredientsController.addIngredient);
router.post('/ingredient/check', ingredientsController.checkIngredient);
router.put('/ingredient/update', ingredientsController.updateIngredient);

module.exports = router;
