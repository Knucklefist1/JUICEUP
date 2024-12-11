function ensureAuthenticated(req, res, next) {
  console.log("Session User ID:", req.session.userId); // Add this for debugging

  if (req.session && req.session.userId) {
    return next();
  } else {
    if (req.originalUrl.startsWith('/api/')) {
      return res.status(401).json({ error: "Log in or sign up in order to vote or create a juice." });
    } else {
      return res.redirect("/login.html");
    }
  }
}

module.exports = ensureAuthenticated;
