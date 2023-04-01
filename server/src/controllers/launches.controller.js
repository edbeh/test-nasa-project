const {
  getAllLaunches,
  createLaunch,
  deleteLaunchById,
  helpers,
} = require("../services/launches.services");
const getPagination = require("../utils/getPagination");

const httpGetAllLaunches = async (req, res) => {
  const { limit, skip } = getPagination(req.query);
  const response = await getAllLaunches({ limit, skip });
  return res.status(200).json(response);
};

const httpPostLaunch = async (req, res) => {
  const launch = req.body;

  if (!helpers.isCompletePayload(launch)) {
    return res.status(400).json({
      error: "Missing property in launch payload",
    });
  }

  if (!helpers.isValidDate(launch.launchDate)) {
    return res.status(400).json({
      error: "Launch date is invalid",
    });
  }

  if (!(await helpers.doesPlanetExist(launch.target))) {
    return res.status(400).json({
      error: "Target planet does not exist",
    });
  }

  const latestFlightNumber = await helpers.getLatestFlightNumber();
  const newLaunch = {
    ...launch,
    flightNumber: latestFlightNumber + 1,
    launchDate: new Date(launch.launchDate),
    customers: ["NASA"],
    upcoming: true,
    success: false,
  };

  await createLaunch(newLaunch);
  return res.status(201).json(newLaunch);
};

const httpDeleteLaunch = async (req, res) => {
  const flightNumber = Number(req.params.id);

  if (!(await helpers.doesFlightNumberExist(flightNumber))) {
    return res.status(404).json({ error: "Launch not found" });
  }

  const response = await deleteLaunchById(flightNumber);
  return res.status(200).json(response);
};

module.exports = { httpGetAllLaunches, httpPostLaunch, httpDeleteLaunch };
