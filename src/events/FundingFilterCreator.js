const ethers = require("ethers");
const Funding = require("../contracts/Funding.json");

const FundingFilterCreator = (provider) => (contractAddress) => {
  console.log(contractAddress);
  const FundingContract = new ethers.Contract(
    contractAddress,
    Funding.abi,
    provider
  );

  const priceInAssetUpdated =
    FundingContract.filters.CitadelPriceInAssetUpdated(null);
  const priceBoundSet = FundingContract.filters.CitadelPriceBoundsSet(null);
  const priceFlag = FundingContract.filters.CitadelPriceFlag(null, null, null);

  const fils = {
    address: contractAddress,
    topics: [
      [
        ...priceInAssetUpdated.topics,
        ...priceBoundSet.topics,
        ...priceFlag.topics,
      ],
    ],
  };

  return fils;
};

module.exports = FundingFilterCreator;
