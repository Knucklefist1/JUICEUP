function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    // User is logged in, proceed to the next middleware
    return next();
  } else {
    if (req.accepts('html')) {
      // If the request expects HTML, redirect to login page
      return res.redirect("/login.html");
    } else {
      // If the request expects JSON (e.g., an API call), respond with 401
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
  }
}

module.exports = ensureAuthenticated;
