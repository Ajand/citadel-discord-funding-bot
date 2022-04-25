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
    happenedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

PriceFlagSchema.index({ createdAt: 1 });

const PriceFlag = mongoose.model("priceFlag", PriceFlagSchema);

const methods = {
  queries: {},
  commands: {
    create: (variant, happenedAt, { minPrice, maxPrice, price }) => {
      const p = new PriceFlag({
        variant,
        happenedAt,
        minPrice,
        maxPrice,
        price,
      });
      return p.save();
    },
  },
};

module.exports = {
  collection: PriceFlag,
  methods,
};
