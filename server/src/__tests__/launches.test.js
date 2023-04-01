const request = require("supertest");

const app = require("../app");
const { helpers: planetHelpers } = require("../services/planets.services");
const { connectDb, disconnectDb } = require("../configs/db.config");

describe("Launches API", () => {
  beforeAll(async () => {
    await connectDb();
    await planetHelpers.loadPlanets();
  });

  afterAll(async () => {
    await disconnectDb();
  });

  describe("GET /launches api", () => {
    it("called successfully", async () => {
      await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /application\/json/i);
    });
  });

  describe("POST /launches api", () => {
    it("called successfully", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "ZTM155",
          rocket: "ZTM Experimental IS1",
          target: "Kepler-62 f",
          launchDate: "2028-12-01",
        })
        .expect(201)
        .expect("Content-Type", /application\/json/i);

      expect(response.body).toMatchObject({
        mission: "ZTM155",
        rocket: "ZTM Experimental IS1",
        target: "Kepler-62 f",
        launchDate: "2028-12-01T00:00:00.000Z",
      });
    });

    it("catch missing launchDate", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "ZTM155",
          rocket: "ZTM Experimental IS1",
          target: "Kepler-62 f",
          launchDate: "invalid_string",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/i);

      expect(response.body).toStrictEqual({
        error: "Launch date is invalid",
      });
    });

    it("catch missing fields", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({
          mission: "ZTM155",
          rocket: "ZTM Experimental IS1",
        })
        .expect(400)
        .expect("Content-Type", /application\/json/i);

      expect(response.body).toStrictEqual({
        error: "Missing property in launch payload",
      });
    });
  });
});
