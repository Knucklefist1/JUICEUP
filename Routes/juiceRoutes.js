const express = require("express");
const router = express.Router();
const juiceController = require("../Controllers/juiceController");

// Rute for at tilføje en juice
router.post("/add", juiceController.addJuice);

module.exports = router;
