const express = require("express");
const juiceIngredientController = require("../Controllers/juiceIngredientController");
const router = express.Router();

// Route til at tilføje en juice-ingrediens
router.post("/juice/ingredient/add", juiceIngredientController.addJuiceIngredient);

module.exports = router;
