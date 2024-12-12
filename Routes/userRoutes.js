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
router.put("/profile/password", ensureAuthenticated, userController.updatePassword); // New route for password update

// Check authentication status
router.get("/check-auth", (req, res) => {
    if (req.session && req.session.userId) {
      res.json({ isAuthenticated: true });
    } else {
      res.json({ isAuthenticated: false });
    }
  });
  

module.exports = router;
