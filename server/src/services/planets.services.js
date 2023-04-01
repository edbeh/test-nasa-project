const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planetsModel = require("../models/planets.model");

const getAllPlanets = async () => {
  return await planetsModel.find({}, { _id: 0, __v: 0 });
};

const createPlanet = async (data) => {
  await planetsModel.updateOne(
    {
      keplerName: data.kepler_name, // original value
    },
    {
      keplerName: data.kepler_name, // new value
    },
    {
      upsert: true, // insert if not exist, otherwise update
    }
  );
};

// *Helpers
const helpers = {
  isHabitablePlanet: (planet) => {
    return (
      planet["koi_disposition"] === "CONFIRMED" &&
      planet["koi_insol"] > 0.36 &&
      planet["koi_insol"] < 1.11 &&
      planet["koi_prad"] < 1.6
    );
  },
  loadPlanets: () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(
        path.join(__dirname, "..", "..", "data", "kepler_data.csv")
      )
        .pipe(
          parse({
            comment: "#",
            columns: true,
          })
        )
        .on("data", async (data) => {
          if (helpers.isHabitablePlanet(data)) {
            createPlanet(data);
          }
        })
        .on("error", (err) => {
          console.log("error", err);
          reject(err);
        })
        .on("end", async () => {
          const planets = await getAllPlanets();
          resolve();
        });
    });
  },
};

module.exports = { getAllPlanets, helpers };
