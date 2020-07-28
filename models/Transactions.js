const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  blockHash: {
    type: String,
    required: true,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  blockNumber: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
