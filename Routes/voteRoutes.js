const express = require("express");
const voteController = require("../Controllers/voteController"); // Importerer controlleren til stemmehåndtering
const ensureAuthenticated = require("../Middleware/middleware"); // Importerer middleware til autentifikation

const router = express.Router();

// Route til at afgive en stemme - kun tilgængelig for loggede brugere
router.post("/vote", ensureAuthenticated, voteController.addVote);

// Eksporterer routeren til brug i andre dele af applikationen
module.exports = router;
