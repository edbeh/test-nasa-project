const fs = require("fs");
const https = require("https");
require("dotenv").config(); // inject .env values

const app = require("./app");
const { connectDb } = require("./configs/db.config");
const { helpers: planetHelpers } = require("./services/planets.services");
const { helpers: launchHelpers } = require("./services/launches.services");

const PORT = process.env.PORT || 8000;
const server = https.createServer(
  { key: fs.readFileSync("./key.pem"), cert: fs.readFileSync("./cert.pem") }, // cert & key created with openssl
  app
); // separating express into separate file for easier testing

const startServer = async () => {
  await connectDb();
  await planetHelpers.loadPlanets();
  await launchHelpers.loadSpaceXData();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

startServer();
