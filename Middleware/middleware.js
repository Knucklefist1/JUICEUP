function ensureAuthenticated(req, res, next) {
  console.log("Session User ID:", req.session.userId); // Debug: Logger brugerens session-ID

  // Tjekker om brugeren er autentificeret
  if (req.session && req.session.userId) {
    return next(); // Fortsæt til næste middleware eller route
  } else {
    // Hvis ruten starter med '/api/', returnér en JSON-fejlmeddelelse
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ error: "Log in or sign up in order to vote or create a juice." });
    } else {
      // Ellers omdiriger til login-siden
      return res.redirect("/login.html");
    }
  }
}

module.exports = ensureAuthenticated;
