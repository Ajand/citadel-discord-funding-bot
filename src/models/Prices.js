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
  queries: {
    getLast: () => {
      return new Promise((resolve, reject) => {
        Price.findOne({}, {}, { sort: { created_at: -1 } }, (err, price) => {
          if (err) return reject(err);
          return resolve(price);
        });
      });
    },
  },
  commands: {
    create: (variant, price) => {
      const p = new Price({ variant, price });
      return p.save();
    },
  },
};

module.exports = {
  collection: Price,
  methods,
};
