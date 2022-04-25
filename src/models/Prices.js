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
    happenedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

PriceSchema.index({ createdAt: 1 });

var Price = mongoose.model("prices", PriceSchema);

const methods = {
  queries: {
    getLast: (variant) => {
      return new Promise((resolve, reject) => {
        Price.findOne(
          { variant },
          {},
          { sort: { happenedAt: -1 } },
          (err, price) => {
            if (err) return reject(err);
            return resolve(price);
          }
        );
      });
    },
  },
  commands: {
    create: (variant, happenedAt, price) => {
      const p = new Price({ variant, happenedAt, price });
      return p.save();
    },
  },
};

module.exports = {
  collection: Price,
  methods,
};
