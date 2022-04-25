const mongoose = require("mongoose");

var PriceBoundSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["wbtc", "cvx"],
    },
    minPrice: {
      type: String,
    },
    maxPrice: {
      type: String,
    },
  },
  { timestamp: true }
);

PriceBoundSchema.index({ createdAt: 1 });

var PriceBound = mongoose.model("events", PriceBoundSchema);

const methods = {
  queries: {},
  commands: {},
};

module.exports = {
  collection: PriceBound,
  methods,
};
