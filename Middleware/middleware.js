function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      res.redirect(`/login.html?error=not_logged_in`); // Redirect with query parameter indicating error
    }
  }
  
  module.exports = ensureAuthenticated;
  