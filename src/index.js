require("./mongooseConnector");
const { ethers } = require("ethers");
const config = require("./config.json");

const Events = require("./models/Events");

const EventSerializer = require("./events/EventSerializer");

const EventProcessor = require("./events/EventProcessor");

const DiscordManager = require("./lib/DiscordManager");
const JobQueue = require("./lib/JobQueue");

const handleFundingEventStream = require("./lib/handleFundingEventStream");

const main = async () => {
  const discordManager = await DiscordManager();

  const provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);

  handleFundingEventStream(provider)("wbtc", config.FUNDING_WBTC_ADDRESS);
  handleFundingEventStream(provider)("cvx", config.FUNDING_CVX_ADDRESS);

  const wbtcJobQueue = JobQueue();
  const cvxJobQueue = JobQueue();

  setInterval(async () => {
    const wbtcNotProcessedEvents = await EventSerializer(
      config.FUNDING_WBTC_ADDRESS,
      0
    );
    wbtcNotProcessedEvents.forEach((ev) => {
      wbtcJobQueue.addJob(ev);
    });
    const cvxNotProcessedEvents = await EventSerializer(
      config.FUNDING_CVX_ADDRESS,
      0
    );
    cvxNotProcessedEvents.forEach((ev) => {
      cvxJobQueue.addJob(ev);
    });
  }, 1000);

  const setEventProcessed = (_id) => {
    return new Promise((resolve, reject) => {
      Events.updateOne({ _id }, { $set: { processed: true } }, (err, done) => {
        if (err) return reject(err);
        return resolve(done);
      });
    });
  };

  setInterval(() => {
    wbtcJobQueue.execute(async (currentJob) => {
      await EventProcessor("wbtc", discordManager)(currentJob);
      await setEventProcessed(currentJob._id);
    });

    cvxJobQueue.execute(async (currentJob) => {
      await EventProcessor("cvx", discordManager)(currentJob);
      await setEventProcessed(currentJob._id);
    });
  }, 1000);
};

main();
