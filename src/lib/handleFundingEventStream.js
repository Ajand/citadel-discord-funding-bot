const path = require("path");
const { ethers } = require("ethers");
const FetchEvents = require("../events/FetchEvents");
const Funding = require("../contracts/Funding.json");
const FundingFilterCreator = require("../events/FundingFilterCreator");
const SingleEventSaver = require("../events/SingleEventSaver");
const GetBlockTimestamp = require("./GetBlockTimestamp");
const LocalStorage = require("node-localstorage").LocalStorage;

const localStorage = new LocalStorage(
  path.resolve(__dirname, "..", "..", "data")
);

const handleFundingEventStream =
  (provider) => async (storagePrefix, contractAddress) => {
    const targetContract = new ethers.Contract(
      contractAddress,
      Funding.abi,
      provider
    );

    await FetchEvents(provider)(storagePrefix, targetContract.address);

    setInterval(async () => {
      await FetchEvents(provider)(storagePrefix, targetContract.address);
    }, 60 * 2 * 1000);

    targetContract.on(
      FundingFilterCreator(provider)(targetContract.address),
      async (event) => {
        const happenedAt = await GetBlockTimestamp(provider)(event.blockNumber);

        SingleEventSaver(happenedAt)(event)
          .then((r) => console.log("event saved"))
          .catch((err) => console.log(err));
        localStorage.setItem(`${storagePrefix}LastFetched`, event.blockNumber);
      }
    );
  };

module.exports = handleFundingEventStream;
