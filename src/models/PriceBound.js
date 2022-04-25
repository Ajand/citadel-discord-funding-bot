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
    happenedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

PriceBoundSchema.index({ createdAt: 1 });

var PriceBound = mongoose.model("priceBound", PriceBoundSchema);

const methods = {
  queries: {},
  commands: {
    create: (variant, happenedAt, { minPrice, maxPrice }) => {
      const p = new PriceBound({ variant,happenedAt, minPrice, maxPrice });
      return p.save();
    },
  },
};

module.exports = {
  collection: PriceBound,
  methods,
};
