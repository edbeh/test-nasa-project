const express = require("express");

const launchesController = require("../controllers/launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", launchesController.httpGetAllLaunches);

launchesRouter.post("/", launchesController.httpPostLaunch);

launchesRouter.delete("/:id", launchesController.httpDeleteLaunch);

module.exports = launchesRouter;
