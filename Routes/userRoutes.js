const express = require("express");
const userController = require("../Controllers/userController");
const ensureAuthenticated = require("../Middleware/middleware"); // Import the middleware
const router = express.Router();

// Public routes
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/profile", ensureAuthenticated, userController.getProfile);
router.put("/profile/email", ensureAuthenticated, userController.updateEmail);

module.exports = router;
