const express = require("express");
const voteController = require("../Controllers/voteController"); // Import the controller
const ensureAuthenticated = require("../Middleware/middleware"); // Import middleware
const router = express.Router();

// Route to cast a vote - only accessible if logged in
router.post("/vote", ensureAuthenticated, voteController.addVote);

module.exports = router;
