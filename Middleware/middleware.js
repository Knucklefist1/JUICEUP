function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    // User is logged in, proceed to the next middleware
    return next();
  } else {
    // User is not logged in
    return res.redirect("/login.html"); // Only redirect if it's a page that needs to be protected
  }
}

module.exports = ensureAuthenticated;
