const axios = require("axios");

const launchesModel = require("../models/launches.model");
const planetsModel = require("../models/planets.model");

const getAllLaunches = async ({ limit, skip }) => {
  const launches = await launchesModel
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
  return launches;
};

const createLaunch = async (launch) => {
  return await launchesModel.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
};

const deleteLaunchById = async (flightNumber) => {
  const abortedLaunch = await launchesModel.findOneAndUpdate(
    { flightNumber },
    {
      upcoming: false,
      success: false,
    },
    {
      new: true,
    }
  );

  return abortedLaunch;
};

//* Helpers
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_BASE_URL = "https://api.spacexdata.com/v4";

const helpers = {
  isCompletePayload: (launch) => {
    return (
      launch.mission && launch.rocket && launch.target && launch.launchDate
    );
  },
  isValidDate: (string) => {
    const date = new Date(string);
    if (date.toString() === "Invalid Date") {
      return false;
    }
    return true;
  },
  doesFlightNumberExist: async (flightNumber) => {
    const launch = await launchesModel.findOne({ flightNumber });
    return !!launch;
  },
  doesPlanetExist: async (target) => {
    const planet = await planetsModel.findOne({ keplerName: target });
    return !!planet;
  },
  getLatestFlightNumber: async () => {
    const latestLaunch = await launchesModel.findOne().sort("-flightNumber");
    if (latestLaunch && latestLaunch.flightNumber) {
      return Number(latestLaunch.flightNumber);
    } else {
      return DEFAULT_FLIGHT_NUMBER;
    }
  },
  loadSpaceXData: async () => {
    const firstLaunch = await launchesModel.findOne({
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat",
    });

    // skip api call to space x api if launches already saved
    if (!firstLaunch) {
      await helpers.populateSpaceXData();
    }
  },
  populateSpaceXData: async () => {
    const response = await axios.post(`${SPACEX_API_BASE_URL}/launches/query`, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });

    try {
      await response.data.docs.map(async (launch) => {
        const customers = launch.payloads.flatMap(
          (payload) => payload.customers
        );
        await createLaunch({
          flightNumber: launch.flight_number,
          mission: launch.name,
          rocket: launch.rocket.name,
          launchDate: launch.date_local,
          upcoming: launch.upcoming,
          success: launch.success,
          customers,
        });
      });
    } catch (err) {
      console.error("error saving space x data", err);
    }
  },
};

module.exports = {
  getAllLaunches,
  createLaunch,
  deleteLaunchById,
  helpers,
};
