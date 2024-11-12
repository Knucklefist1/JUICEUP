const express = require("express");
const ingredientsController = require("../Controllers/ingredientsController");
const router = express.Router();

// Route til at tilføje en ingrediens
router.post("/ingredient/add", ingredientsController.addIngredient);

module.exports = router;
