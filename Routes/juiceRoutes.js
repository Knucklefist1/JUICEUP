// juiceRoutes.js
const express = require("express");
const path = require("path");
const juiceController = require("../Controllers/juiceController");
const ensureAuthenticated = require("../Middleware/middleware");
const router = express.Router();

// Route to add a new juice - only accessible if logged in
router.post("/juice/add", ensureAuthenticated, juiceController.addJuice);

// Route to serve the createNow.html page - only accessible if logged in
router.get("/create", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'createNow.html'));
});

// Route to get all juices for leaderboard - No authentication required
router.get("/getAll", juiceController.getAllJuices);

module.exports = router;
