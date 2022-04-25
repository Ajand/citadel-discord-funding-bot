const mongoose = require("mongoose");

var PriceSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      enum: ["wbtc", "cvx"],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

PriceSchema.index({ createdAt: 1 });

var Price = mongoose.model("prices", PriceSchema);

const methods = {
  queries: {},
  commands: {},
};

module.exports = {
  collection: Price,
  methods,
};
