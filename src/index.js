const { ethers } = require("ethers");
const config = require("./config.json");

const Funding = require("./contracts/Funding.json");

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

  
};

main();
