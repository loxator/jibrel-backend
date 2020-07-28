const cleanTransactionData = (transactionArray, web3) => {
  let cleanedTransactionArray = [];
  transactionArray.map((transaction) => {
    const { address, blockHash, transactionHash, blockNumber } = transaction;
    const { from, to, value } = transaction.returnValues;
    let cleanedObject = {
      address,
      blockHash,
      transactionHash,
      blockNumber,
      from,
      to,
      value: web3.utils.fromWei(value, "ether"),
    };
    cleanedTransactionArray.push(cleanedObject);
  });

  return cleanedTransactionArray;
};

const cleanTransactionDataForOwner = (transactionArray, owner, web3) => {
  let cleanedTransactionArray = [];
  transactionArray.map((transaction) => {
    const {
      contractAddress,
      blockHash,
      hash,
      blockNumber,
      from,
      to,
      value,
    } = transaction;

    let cleanedObject = {
      address: contractAddress,
      blockHash,
      transactionHash: hash,
      blockNumber,
      from,
      to,
      value: web3.utils.fromWei(value, "ether"),
      owner,
    };
    cleanedTransactionArray.push(cleanedObject);
  });

  return cleanedTransactionArray;
};

module.exports = {
  cleanTransactionDataForOwner,
  cleanTransactionData,
};
