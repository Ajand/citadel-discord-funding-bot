const mongoose = require("mongoose");

const PriceFlagSchema = new mongoose.Schema(
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
    price: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

PriceBoundSchema.index({ createdAt: 1 });

const PriceFlag = mongoose.model("priceFlag", PriceFlagSchema);

const methods = {
  queries: {},
  commands: {},
};

module.exports = {
  collection: PriceBound,
  methods,
};
