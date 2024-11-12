const express = require("express");
const router = express.Router();
const juiceIngredientController = require("../Controllers/juiceIngredientController");

// Rute for at tilføje en juice-ingrediens
router.post("/add", juiceIngredientController.addJuiceIngredient);

module.exports = router;
