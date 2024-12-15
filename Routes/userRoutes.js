const express = require("express");
const userController = require("../Controllers/userController");
const ensureAuthenticated = require("../Middleware/middleware"); // Importerer middleware til autentifikation
const router = express.Router();

// Offentlige ruter
router.post("/signup", userController.signupUser); // Route til oprettelse af ny bruger
router.post("/login", userController.loginUser); // Route til login

// Beskyttede ruter (kræver login)
router.get("/profile", ensureAuthenticated, userController.getProfile); // Henter brugerens profil
router.put("/profile/email", ensureAuthenticated, userController.updateEmail); // Opdaterer emailadresse
router.put("/profile/password", ensureAuthenticated, userController.updatePassword); // Ny route til opdatering af kodeord

// Tjek autentifikationsstatus
router.get("/check-auth", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ isAuthenticated: true }); // Bruger er logget ind
  } else {
    res.json({ isAuthenticated: false }); // Bruger er ikke logget ind
  }
});

// Eksporterer routeren til brug i andre dele af applikationen
module.exports = router;
