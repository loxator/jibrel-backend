const mongoose = require("mongoose");

const LastBlockDataSchema = new mongoose.Schema({
  lastStartingBlockNumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("LastBlockData", LastBlockDataSchema);
