const { ethers } = require("hardhat");

// Fonction utilitaire pour attendre avec retry en cas de timeout
async function sendWithRetry(txPromise, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const tx = await txPromise();
      const receipt = await tx.wait();
      return tx;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      console.log(`   ⚠️ Tentative ${i + 1} échouée, retry dans 5s...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function main() {
  const [owner] = await ethers.getSigners();

  const CONTRACT_ADDRESS = "0x309A26Fc44cF5DA36E5A5d3f43ACbC8ffDB73489";
  const BCXToken = await ethers.getContractFactory("BCXToken");
  const bcx = BCXToken.attach(CONTRACT_ADDRESS);

  console.log("=== BCX TOKEN — TESTS EN LIVE SEPOLIA ===\n");
  console.log("Owner :", owner.address);

  // TEST 1 : Supply total (lecture — pas de transaction)
  const supply = await bcx.totalSupply();
  console.log("✅ Supply total :", ethers.formatUnits(supply, 18), "BCX");

  // TEST 2 : Solde owner (lecture — pas de transaction)
  const soldeOwner = await bcx.balanceOf(owner.address);
  console.log("✅ Solde owner  :", ethers.formatUnits(soldeOwner, 18), "BCX");

  // TEST 3 : Transfert 1000 BCX
  const ADRESSE_TEST = "0xe10e3133852564F5b2A58C1578B9B8aDe7498995";
  console.log("\n📤 Transfert de 1000 BCX vers", ADRESSE_TEST, "...");
  try {
    const montant = ethers.parseUnits("1000", 18);
    const tx1 = await bcx.transfer(ADRESSE_TEST, montant);
    console.log("   ⏳ Transaction envoyée, attente confirmation...");
    await tx1.wait();
    console.log("✅ Transfert réussi !");
    console.log("   Hash :", tx1.hash);
    console.log("   🔗 https://sepolia.etherscan.io/tx/" + tx1.hash);

    const soldeTest = await bcx.balanceOf(ADRESSE_TEST);
    console.log("✅ Solde adresse test :", ethers.formatUnits(soldeTest, 18), "BCX");
  } catch (err) {
    console.log("❌ Transfert échoué :", err.message);
  }

  // TEST 4 : Burn 500 BCX
  console.log("\n🔥 Burn de 500 BCX...");
  try {
    const montantBurn = ethers.parseUnits("500", 18);
    const tx2 = await bcx.burn(montantBurn);
    console.log("   ⏳ Transaction envoyée, attente confirmation...");
    await tx2.wait();
    console.log("✅ Burn réussi !");
    console.log("   Hash :", tx2.hash);
    console.log("   🔗 https://sepolia.etherscan.io/tx/" + tx2.hash);

    const supplyApres = await bcx.totalSupply();
    console.log("✅ Supply après burn :", ethers.formatUnits(supplyApres, 18), "BCX");
  } catch (err) {
    console.log("❌ Burn échoué :", err.message);
  }

  // TEST 5 : Lock tokens
  console.log("\n🔒 Lock de 5000 BCX pour l'adresse test...");
  try {
    const montantLock = ethers.parseUnits("5000", 18);

    // Transfert vers adresse test
    const tx3 = await bcx.transfer(ADRESSE_TEST, montantLock);
    console.log("   ⏳ Transfert en cours...");
    await tx3.wait();
    console.log("✅ Transfert pour lock réussi !");

    // Lock
    const tx4 = await bcx.lockTokens(ADRESSE_TEST, montantLock);
    console.log("   ⏳ Lock en cours...");
    await tx4.wait();
    console.log("✅ Lock réussi !");
    console.log("   Hash :", tx4.hash);
    console.log("   🔗 https://sepolia.etherscan.io/tx/" + tx4.hash);

    // Vérification lock
    const [lockedAmount] = await bcx.getLockInfo(ADRESSE_TEST);
    const disponible = await bcx.availableBalance(ADRESSE_TEST);
    console.log("✅ Montant verrouillé :", ethers.formatUnits(lockedAmount, 18), "BCX");
    console.log("✅ Solde disponible   :", ethers.formatUnits(disponible, 18), "BCX (doit être 0)");
  } catch (err) {
    console.log("❌ Lock échoué :", err.message);
  }

  // RÉSUMÉ FINAL
  console.log("\n=== RÉSUMÉ FINAL ===");
  const supplyFinal = await bcx.totalSupply();
  const soldeFinal = await bcx.balanceOf(owner.address);
  console.log("Supply final :", ethers.formatUnits(supplyFinal, 18), "BCX");
  console.log("Solde owner  :", ethers.formatUnits(soldeFinal, 18), "BCX");
  console.log("\n🔗 Contrat : https://sepolia.etherscan.io/address/" + CONTRACT_ADDRESS);
  console.log("\n=== TESTS EN LIVE TERMINÉS ! ===");
}

main().catch((e) => { console.error(e); process.exit(1); });