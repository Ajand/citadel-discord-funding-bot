const cachedTimestmaps = new Map();

const GetBlockTimestamp = (provider) => async (blockNumber) => {
  if (cachedTimestmaps.get(blockNumber))
    return cachedTimestmaps.get(blockNumber);
  const block = await provider.getBlock(blockNumber);
  const timestamp = block.timestamp * 1000;
  cachedTimestmaps.set(blockNumber, timestamp);
  return timestamp;
};

module.exports = GetBlockTimestamp;
