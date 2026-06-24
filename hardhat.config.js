require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
const dotenv = require('dotenv');

const rootEnvPath = path.resolve(__dirname, '.env');
const backendEnvPath = path.resolve(__dirname, 'backend', '.env');

const rootEnv = dotenv.config({ path: rootEnvPath });
if (rootEnv.error) {
  const backendEnv = dotenv.config({ path: backendEnvPath });
  if (backendEnv.error) {
    console.warn('No .env file found in project root or backend folder.');
  } else {
    console.log(`Loaded env from ${backendEnvPath}`);
  }
} else {
  console.log(`Loaded env from ${rootEnvPath}`);
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://ethereum-sepolia-rpc.publicnode.com",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
    bscTestnet: {
      url: "https://bsc-testnet-rpc.publicnode.com",
      chainId: 97,
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
    },
  },
};