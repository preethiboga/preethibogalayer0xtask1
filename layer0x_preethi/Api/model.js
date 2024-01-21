const mongoose = require("mongoose");

const blockchainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chainId: { type: String, required: true },
  apiUrl: { type: String, required: true },
  rpcUrl: { type: String, required: true },
});

module.exports = mongoose.model("Blockchain", blockchainSchema);