const mongoose = require("mongoose");

var PriceSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["wbtc", "cvx"],
    },
    price: {
      type: String,
    },
  },
  { timestamp: true }
);

PriceSchema.index({ createdAt: 1 });

var Price = mongoose.model("events", PriceSchema);

const methods = {
  queries: {},
  commands: {},
};

module.exports = {
  collection: Price,
  methods,
};
