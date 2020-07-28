const getABI = async ({ tokenAddress }) => {
  const axios = require("axios");

  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    if (response) return JSON.parse(response.data.result);
    else throw Error("Failed!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = getABI;
