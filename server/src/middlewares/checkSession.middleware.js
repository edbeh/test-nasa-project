const checkSession = (req, res, next) => {
  // req.isAuthenticated is a built in function to check for passport session
  if (!req.isAuthenticated() && !req.user) {
    return res.status(401).json({ error: "User is not logged in" });
  }
  next();
};

module.exports = checkSession;
