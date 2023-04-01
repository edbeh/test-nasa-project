const express = require("express");

const secretsController = require("../controllers/secrets.controller");

const secretsRouter = express.Router();

secretsRouter.get("/", secretsController.httpGetAllSecrets);

module.exports = secretsRouter;
