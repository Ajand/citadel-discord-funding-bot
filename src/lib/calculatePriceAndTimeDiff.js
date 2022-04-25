require("../mongooseConnector");
const { ethers } = require("ethers");
const Price = require("../models/Prices");
const moment = require("moment");

const calculatePriceAndTimeDiff = (variant) => async (newPrice, newDate) => {
  const lastPriceItem = await Price.methods.queries.getLast(variant);

  if (!lastPriceItem) {
    return {
      changeRate: 0,
      duration: 0,
    };
  }

  const BN = ethers.BigNumber;

  const lastPrice = BN.from(lastPriceItem.price);

  const changeRate = newPrice.sub(lastPrice).mul(10000).div(newPrice);
  const duration = moment(newDate).diff(moment(lastPriceItem.happenedAt));

  return {
    changeRate: (Number(String(changeRate)) / 100).toFixed(2),
    duration: moment.duration(duration).humanize()
  };
};

module.exports = calculatePriceAndTimeDiff;
