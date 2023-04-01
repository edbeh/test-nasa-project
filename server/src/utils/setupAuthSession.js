const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require("dotenv").config();

const googleOAuthConfig = require("../configs/googleOAuth.config");

const setupAuth = () => {
  const authOptions = {
    callbackURL: "/auth/google/callback",
    clientID: googleOAuthConfig.CLIENT_ID,
    clientSecret: googleOAuthConfig.CLIENT_SECRET,
  };

  const verifyCallback = (accessToken, refreshToken, profile, done) => {
    console.log("Google profile", profile);
    done(null, profile); // first arg is error if present
  };

  passport.use(new Strategy(authOptions, verifyCallback));

  // save the session to cookie
  passport.serializeUser((user, done) => {
    done(null, user._json);
  });

  // read the session from the cookie
  passport.deserializeUser((user, done) => {
    done(null, user); // saved from passport.serializeUser above == user.id and sets it to req.session object
  });
};

module.exports = setupAuth;
