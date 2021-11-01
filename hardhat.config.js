require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");
dotenv.config()
const { RINKEBY_ADDRESS, SEED_PHRASE } = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.6",
  networks: {
    localhost: {
      url: 'http://localhost:3000',
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${RINKEBY_ADDRESS}`,
      accounts: {mnemonic: SEED_PHRASE }      
    },

  }
};
