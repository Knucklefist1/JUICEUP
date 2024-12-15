const express = require('express');
const router = express.Router();

const path = require('path'); // Importerer path-modulet til filstier
const juiceIngredientController = require(path.join(__dirname, '..', 'Controllers', 'juiceIngredientController'));

// Route til at tilføje juice-ingrediens
router.post('/juiceIngredient/add', juiceIngredientController.addJuiceIngredient);

// Eksporterer routeren til brug i andre dele af applikationen
module.exports = router;
