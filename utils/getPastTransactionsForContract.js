const { cleanTransactionData } = require("./cleanTransactionData");

const getPastTransactionsForContract = async (
  contract,
  lastStartingBlockNumber,
  latestBlockNumber,
  web3
) => {
  let events;
  try {
    events = await contract.getPastEvents("Transfer", {
      fromBlock: lastStartingBlockNumber,
      toBlock: "latest",
    });
  } catch (error) {
    //If infura fails to give transaction objects, then fallback to latest 10 blocks data
    return getPastTransactionsForContract(
      contract,
      latestBlockNumber - 10,
      lastStartingBlockNumber,
      web3
    );
  }
  if (events.length) {
    return cleanTransactionData(events, web3);
  } else if (lastStartingBlockNumber > 0) {
    return getPastTransactionsForContract(
      contract,
      latestBlockNumber - 100,
      lastStartingBlockNumber,
      web3
    );
  } else return [];
};

module.exports = getPastTransactionsForContract;
