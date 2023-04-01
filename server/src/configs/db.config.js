const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDb = async () => {
  mongoose.connection.once("open", () => {
    console.log("MongoDb has been connected");
  });
  mongoose.connection.on("error", (err) => {
    console.error(err);
  });

  await mongoose.connect(MONGODB_URL);
};

const disconnectDb = async () => {
  await mongoose.disconnect();
};

module.exports = { connectDb, disconnectDb };
