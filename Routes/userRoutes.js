const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

// Route til signup
router.post("/signup", userController.signupUser);

module.exports = router;
