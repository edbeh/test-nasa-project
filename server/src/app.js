const cors = require("cors");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require("passport");
const cookieSession = require("cookie-session");

const planetsRoute = require("./routes/planets.route");
const launchesRoute = require("./routes/launches.route");
const secretsRoute = require("./routes/secrets.route");
const authRoute = require("./routes/auth.route");
const corsConfig = require("./configs/cors.config");
const sessionConfig = require("./configs/session.config");
const checkSession = require("./middlewares/checkSession.middleware");
const setupAuthSession = require("./utils/setupAuthSession");

setupAuthSession();
const app = express();

app.use(cors({ origin: corsConfig.CORS_WHITELIST })); // whitelist domains that can call our api
app.use(morgan("combined")); // logging
app.use(express.json()); // enable req.body json
app.use("/static", express.static(path.join(__dirname, "..", "public"))); // set public route e.g. localhost:3001/static

// security, auth and session related middlewares
app.use(helmet());
app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000, // 1 day (in ms),
    keys: [sessionConfig.COOKIE_KEY_1, sessionConfig.COOKIE_KEY_2], // keys to sign the session. include 2 so we can rotate
    httpOnly: true,
    sameSite: true,
    secure: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.use("/v1/planets", planetsRoute);
app.use("/v1/launches", launchesRoute);
app.use("/v1/secrets", checkSession, secretsRoute);

module.exports = app;
