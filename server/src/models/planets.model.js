const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// connects planetsSchema with "planets" collection (lowercase and pluralized)
module.exports = mongoose.model("planet", planetsSchema);
