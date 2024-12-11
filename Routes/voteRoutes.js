const express = require("express");
const voteController = require("../Controllers/voteController");
const ensureAuthenticated = require("../Middleware/middleware");
const router = express.Router();

// Route to cast a vote
router.post("/api/vote", ensureAuthenticated, voteController.addVote);

module.exports = router;
