const mongoose = require("mongoose");

var PriceBoundSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["wbtc", "cvx"],
      required: true,
    },
    minPrice: {
      type: String,
      required: true,
    },
    maxPrice: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

PriceBoundSchema.index({ createdAt: 1 });

var PriceBound = mongoose.model("priceBound", PriceBoundSchema);

const methods = {
  queries: {},
  commands: {},
};

module.exports = {
  collection: PriceBound,
  methods,
};