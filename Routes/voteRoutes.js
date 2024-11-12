const express = require("express");
const router = express.Router();
const voteController = require("../Controllers/voteController");

// Rute for at tilføje en stemme
router.post("/add", voteController.addVote);

module.exports = router;
