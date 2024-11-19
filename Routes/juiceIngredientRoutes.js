const express = require('express');
const router = express.Router();

const path = require('path');
const juiceIngredientController = require(path.join(__dirname, '..', 'Controllers', 'juiceIngredientController'));

router.post('/juiceIngredient/add', juiceIngredientController.addJuiceIngredient);

module.exports = router;
