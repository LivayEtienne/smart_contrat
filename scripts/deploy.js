const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Déploiement avec :", deployer.address);
  console.log("Solde :", ethers.formatEther(
    await ethers.provider.getBalance(deployer.address)
  ), "BNB");

  const BCXToken = await ethers.getContractFactory("BCXToken");
  console.log("Déploiement en cours...");
  const token = await BCXToken.deploy();
  await token.waitForDeployment();

  console.log("✅ BCX Token déployé à :", await token.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });  