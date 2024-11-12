const express = require("express");
const juiceController = require("../Controllers/juiceController");
const router = express.Router();

// Route til at tilføje en ny juice
router.post("/juice/add", juiceController.addJuice);

module.exports = router;
