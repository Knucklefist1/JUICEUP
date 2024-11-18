const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");

router.post("/login", userController.loginUser);
router.post("/signup", userController.signupUser);
router.post("/logout", userController.logoutUser); // Tilføj logout route

// Profile routes
router.get("/profile", userController.getProfile);
router.put("/profile/email", userController.updateEmail);

module.exports = router;
