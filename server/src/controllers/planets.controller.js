const { getAllPlanets } = require("../services/planets.services");

const httpGetAllPlanets = async (req, res) => {
  return res.status(200).json(await getAllPlanets());
};

module.exports = { httpGetAllPlanets };
