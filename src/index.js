require("./mongooseConnector");
const { ethers } = require("ethers");
const config = require("./config.json");

const Funding = require("./contracts/Funding.json");

const FundingFilterCreator = require("./events/FundingFilterCreator");

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

  const cvxFunding = new ethers.Contract(
    config.FUNDING_CVX_ADDRESS,
    Funding.abi,
    provider
  );
  const wbtcFunding = new ethers.Contract(
    config.FUNDING_WBTC_ADDRESS,
    Funding.abi,
    provider
  );

  console.log(wbtcFunding.address, cvxFunding.address);

  const lastBlock = await provider.getBlock();

  // const cvxFileteredEvents = await cvxFunding.queryFilter(
  //   FundingFilterCreator(provider)(cvxFunding.address),
  //   config.STARTING_BLOCK,
  //   lastBlock.number
  // );
  //
  // console.log(cvxFileteredEvents);

  console.log(FundingFilterCreator(provider)(wbtcFunding.address));
  const btcFileteredEvents = await wbtcFunding.queryFilter(
    FundingFilterCreator(provider)(wbtcFunding.address),
    config.STARTING_BLOCK,
    lastBlock.number
  );

  console.log(btcFileteredEvents);

  // wbtcFunding.on(FundingFilterCreator(provider)(wbtcFunding), (a, b) => {
  //   console.log(a, b);
  // });

  // console.log(cvxFileteredEvents);
  // console.log(btcFileteredEvents);
};

main();
