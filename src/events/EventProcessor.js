const Price = require("../models/Prices");
const PriceFlag = require("../models/PriceFlag");
const PriceBound = require("../models/PriceBound");
const calculatePriceAndTimeDiff = require("../lib/calculatePriceAndTimeDiff");

const EventProcessor = (variant, discordManager) => async (ev) => {
  const parseVariant = (variant) => {
    switch (variant) {
      case "wbtc":
        return "WBTC";
      case "cvx":
        return "CVX";
    }
  };

  switch (ev.name) {
    case "CitadelPriceBoundsSet": {
      await PriceBound.methods.commands.create(variant, ev.happenedAt, {
        minPrice: ev.args.minPrice,
        maxPrice: ev.args.maxPrice,
      });
      discordManager.sendMessage(
        `Price bound for (${parseVariant(
          variant
        )}|CTDL) has changed. \nMin price: ${ev.args.minPrice} \nMax price: ${
          ev.args.maxPrice
        }`
      );
      return;
    }
    case "CitadelPriceInAssetUpdated": {
      const { changeRate, duration } = await calculatePriceAndTimeDiff(variant)(
        ev.args.citadelPrice,
        ev.happenedAt
      );
      await Price.methods.commands.create(
        variant,
        ev.happenedAt,
        ev.args.citadelPrice
      );
      discordManager.sendMessage(
        `Citadel Price / ${parseVariant(
          variant
        )} has been changed. \nNew price: ${
          ev.args.citadelPrice
        } \n${changeRate}% change in ${duration}`
      );
      return;
    }
    case "CitadelPriceFlag": {
      /// Price flag is also a CitadelPriceInAssetUpdated
      const { changeRate, duration } = await calculatePriceAndTimeDiff(variant)(
        ev.args.price,
        ev.happenedAt
      );
      await Price.methods.commands.create(
        variant,
        ev.happenedAt,
        ev.args.price
      );
      await PriceFlag.methods.commands.create(variant, ev.happenedAt, {
        minPrice: ev.args.minPrice,
        maxPrice: ev.args.maxPrice,
        price: ev.args.price,
      });
      discordManager.sendNotifyMessage(
        `Attention ::notifyRole::! The price in ${parseVariant(
          variant
        )} is flagged for being out of bounds! \nMin price: ${
          ev.args.minPrice
        } \nMax price: ${ev.args.maxPrice} \nCurrent Price: ${
          ev.args.price
        } \n${changeRate}% change in ${duration}`
      );
      return;
    }
  }
};

module.exports = EventProcessor;
