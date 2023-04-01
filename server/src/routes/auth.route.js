const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/v1/secrets",
    session: true, // set session to true since we're using cookie-session
  }),
  (req, res) => {
    console.log("Google called us back :)");
  }
);

authRouter.get("/failure", (req, res) => {
  res.status(401).json({ error: "Failed to login" });
});

authRouter.get("/logout", (req, res) => {
  req.logout(); // removes req.user and clears any logged in session
  return res.redirect("/v1/secrets");
});

module.exports = authRouter;
