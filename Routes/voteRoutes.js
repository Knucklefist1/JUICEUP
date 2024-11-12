const express = require("express");
const voteController = require("../Controllers/voteController");
const router = express.Router();

// Route til at tilføje en stemme
router.post("/vote/add", voteController.addVote);

module.exports = router;
