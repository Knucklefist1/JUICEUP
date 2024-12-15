// juiceRoutes.js
const express = require("express");
const path = require("path");
const juiceController = require("../Controllers/juiceController");
const ensureAuthenticated = require("../Middleware/middleware");
const router = express.Router();

// Route til at tilføje en ny juice - kun tilgængelig, hvis brugeren er logget ind
router.post("/juice/add", ensureAuthenticated, juiceController.addJuice);

// Route til at servere createNow.html-siden - kun tilgængelig, hvis brugeren er logget ind
router.get("/create", ensureAuthenticated, (req, res) => {
  // Sørg for at servere denne fil via HTTPS i produktion
  res.sendFile(path.join(__dirname, '../Public', 'createNow.html'));
});

// Route til at hente alle juices til leaderboardet - ingen autentifikation kræves
router.get("/getAll", juiceController.getAllJuices);

// Eksporterer routeren til brug i andre dele af applikationen
module.exports = router;
