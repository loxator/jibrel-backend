const { cleanTransactionDataForOwner } = require("./cleanTransactionData");

const getTransactionsForAccount = async ({ tokenAddress, owner, web3 }) => {
  const axios = require("axios");

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${owner}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    if (response.data.status === "1") {
      let result = cleanTransactionDataForOwner(
        response.data.result.filter(
          (transaction) => transaction.contractAddress === tokenAddress
        ),
        owner,
        web3
      );

      return result;
    } else throw Error("Some error occurred");
  } catch (error) {
    console.log("getTransactionsForAccount -> error", error);
    //return error.data.result;
  }
};

module.exports = getTransactionsForAccount;
