let express = require("express");
let router = express.Router();

//Load Web3
let Web3 = require("web3");
let web3 = new Web3(process.env.INFURA_API);

//Helper methods
const getABI = require("../utils/getABI");
const getPastTransactionsForContract = require("../utils/getPastTransactionsForContract");
const getTransactionForAccount = require("../utils/getTransactionsForAccount");

//DB Models
const LastBlockData = require("../models/LastblockData");
const Transaction = require("../models/Transactions");

router.post("/:tokenAddress", async function (req, res, next) {
  try {
    let result = [];
    const { tokenAddress } = req.body;
    const ABI = await getABI({ tokenAddress });
    let contract = new web3.eth.Contract(ABI, tokenAddress);

    const latestBlockNumber = await web3.eth.getBlockNumber();
    let lastSavedBlockNumberData = await LastBlockData.findOne({
      address: tokenAddress,
    }).exec();

    if (
      lastSavedBlockNumberData === undefined ||
      lastSavedBlockNumberData === null
    ) {
      //Use the previous latest as the start point for the next time this API is called
      await LastBlockData.create({
        lastStartingBlockNumber: latestBlockNumber,
        address: tokenAddress,
      });

      //Initially query 10 blocks
      lastSavedBlockNumberData = {
        lastStartingBlockNumber: latestBlockNumber - 10,
      };
    }
    if (
      latestBlockNumber !== lastSavedBlockNumberData.lastStartingBlockNumber
    ) {
      //Get new records starting from previous and update the latest number
      await LastBlockData.findOneAndUpdate(
        { address: tokenAddress },
        { lastStartingBlockNumber: latestBlockNumber }
      ).exec();
    }
    result = await getPastTransactionsForContract(
      contract,
      lastSavedBlockNumberData.lastStartingBlockNumber,
      latestBlockNumber,
      web3
    );

    if (result.length) {
      res.json({ data: result, status: "OK", error: null });
    } else {
      res.json({
        data: result,
        status: "ERROR",
        error: "No transactions found. Please check your inputs.",
      });
    }
  } catch (error) {
    res.json({
      data: error,
      status: "ERROR",
      error: "No transactions found. Please check your inputs.",
    });
  }
});

router.get("/:tokenAddress", async (req, res, next) => {
  const { tokenAddress } = req.params;
  const { owner, limit } = req.query;
  let result = [];
  try {
    if (!owner) {
      res.json({
        result: null,
        status: "ERROR",
        error: "Send owner's wallet address",
      });
    }
    const previousTransactions = await Transaction.find({
      address: tokenAddress,
    }).exec();

    const accountTransactions = await getTransactionForAccount({
      tokenAddress,
      owner,
      web3,
    });

    //If tokens are already in DB, filter duplicates and just add new ones
    //If not, then it will add only new ones
    if (previousTransactions) {
      if (previousTransactions.length !== accountTransactions.length) {
        let newTransactions = [
          ...new Set([...previousTransactions, ...accountTransactions]),
        ];
        await Transaction.insertMany(newTransactions);
        result = [...newTransactions];
      }
    }
    result = [
      ...(await Transaction.find({ address: tokenAddress })
        .sort({
          blockNumber: -1,
        })
        .limit(parseInt(limit, 10))),
      ...result,
    ];
    if (result.length) {
      res.json({ data: result, status: "OK", error: null });
    } else {
      res.json({
        data: result,
        status: "ERROR",
        error: "No transactions found. Please check your inputs.",
      });
    }
  } catch (error) {
    res.json({
      data: error,
      status: "ERROR",
      error: "No transactions found. Please check your inputs.",
    });
  }
});

module.exports = router;
