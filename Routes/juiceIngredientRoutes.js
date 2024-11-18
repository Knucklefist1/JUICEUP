const express = require("express");
const juiceIngredientController = require("../Controllers/juiceIngredientController"); // Import the controller
const ensureAuthenticated = require("../Middleware/middleware"); // Import middleware
const router = express.Router();

// Route to add a new juice ingredient - only accessible if logged in
router.post("/ingredient/add", ensureAuthenticated, juiceIngredientController.addJuiceIngredient);

module.exports = router;