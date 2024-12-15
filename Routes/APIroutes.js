// Routes/APIRoutes.js

// Importerer Express til at oprette en router
const express = require("express");
const router = express.Router();

// Test-route for at sikre, at serveren fungerer korrekt
router.get("/test", (req, res) => {
  console.log("Test route hit!"); // Logger besked, når ruten rammes
  res.send("Server is working!"); // Sender svar til klienten
});

// Eksporterer routeren til brug i andre filer
module.exports = router;
