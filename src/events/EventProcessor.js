const Price = require("../models/Prices");
const PriceFlag = require("../models/PriceFlag");
const PriceBound = require("../models/PriceBound");
const calculatePriceAndTimeDiff = require("../lib/calculatePriceAndTimeDiff");

const EventProcessor = (variant) => async (ev) => {
  switch (ev.name) {
    case "CitadelPriceBoundsSet":
      await PriceBound.methods.commands.create(variant, {
        minPrice: ev.args.minPrice,
        maxPrice: ev.args.maxPrice,
      });
      // TODO must add discord functions
      return;
    case "CitadelPriceInAssetUpdated":
      const { changeRate, duration } = await calculatePriceAndTimeDiff();
      console.log(ev.args);
      await Price.methods.commands.create(variant, ev.args.citadelPrice);
      // TODO must add discord functions
      return;
    case "CitadelPriceFlag":
      await PriceFlag.methods.commands.create(variant, {
        minPrice: ev.args.minPrice,
        maxPrice: ev.args.maxPrice,
        price: ev.args.price,
      });
      // TODO must add discord functions
      return;
  }
};

module.exports = EventProcessor;