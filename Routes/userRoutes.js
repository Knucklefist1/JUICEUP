const express = require("express");
const userController = require("../Controllers/userController");
const router = express.Router();

// Signup route handler
router.post("/signup", userController.signupUser);

// Login route handler
router.post("/login", userController.loginUser);

module.exports = router;