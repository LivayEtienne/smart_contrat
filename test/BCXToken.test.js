const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("BCXToken — Tests complets", function () {
  let bcx;
  let owner, pioneer1, user1, user2, attacker;

  const TOTAL_SUPPLY = ethers.parseUnits("100000000", 18);
  const LOCK_DURATION = 365 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, pioneer1, user1, user2, attacker] = await ethers.getSigners();
    const BCXToken = await ethers.getContractFactory("BCXToken");
    bcx = await BCXToken.deploy();
    await bcx.waitForDeployment();
  });

  // ============================================================
  // TEST 1 : DÉPLOIEMENT
  // ============================================================
  describe("1. Déploiement", function () {

    it("doit avoir le bon nom", async function () {
      expect(await bcx.name()).to.equal("BCX Token");
    });

    it("doit avoir le bon symbole", async function () {
      expect(await bcx.symbol()).to.equal("BCX");
    });

    it("doit avoir 18 décimales", async function () {
      expect(await bcx.decimals()).to.equal(18);
    });

    it("doit avoir un supply de 100 000 000 BCX", async function () {
      expect(await bcx.totalSupply()).to.equal(TOTAL_SUPPLY);
    });

    it("doit donner tous les tokens au déployeur", async function () {
      expect(await bcx.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });

    it("doit avoir le bon owner", async function () {
      expect(await bcx.getOwner()).to.equal(owner.address);
    });

  });

  // ============================================================
  // TEST 2 : TRANSFERTS
  // ============================================================
  describe("2. Transferts", function () {

    it("doit transférer des tokens correctement", async function () {
      const montant = ethers.parseUnits("1000", 18);
      await bcx.transfer(user1.address, montant);
      expect(await bcx.balanceOf(user1.address)).to.equal(montant);
    });

    it("doit refuser si le solde est insuffisant", async function () {
      const tropGros = ethers.parseUnits("999999999", 18);
      await expect(
        bcx.connect(user1).transfer(user2.address, tropGros)
      ).to.be.revertedWith("BCX: amount exceeds available balance");
    });

    it("doit refuser un transfert vers l'adresse zéro", async function () {
      await expect(
        bcx.transfer(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("BCX: transfer to zero address");
    });

    it("doit refuser un transfert de montant zéro", async function () {
      await expect(
        bcx.transfer(user1.address, 0)
      ).to.be.revertedWith("BCX: amount must be > 0");
    });

  });

  // ============================================================
  // TEST 3 : APPROVE + TRANSFERFROM (BEP-20 complet)
  // ============================================================
  describe("3. Approve et TransferFrom", function () {

    it("doit approuver une allowance correctement", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      expect(await bcx.allowance(owner.address, user1.address)).to.equal(montant);
    });

    it("doit exécuter transferFrom correctement", async function () {
      const montant = ethers.parseUnits("500", 18);
      // owner approuve user1 à dépenser 500 BCX
      await bcx.approve(user1.address, montant);
      // user1 transfère 500 BCX de owner vers user2
      await bcx.connect(user1).transferFrom(owner.address, user2.address, montant);
      expect(await bcx.balanceOf(user2.address)).to.equal(montant);
    });

    it("doit réduire l'allowance après transferFrom", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      await bcx.connect(user1).transferFrom(owner.address, user2.address, montant);
      // Allowance doit être 0 après utilisation complète
      expect(await bcx.allowance(owner.address, user1.address)).to.equal(0);
    });

    it("doit refuser transferFrom si allowance insuffisante", async function () {
      const montant = ethers.parseUnits("500", 18);
      // Pas d'approbation préalable
      await expect(
        bcx.connect(user1).transferFrom(owner.address, user2.address, montant)
      ).to.be.revertedWith("BCX: transfer amount exceeds allowance");
    });

    // SÉCURITÉ : test de la protection race condition approve
    it("doit refuser de changer une allowance non-nulle directement", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      // Essayer de changer sans remettre à 0 d'abord
      await expect(
        bcx.approve(user1.address, ethers.parseUnits("1000", 18))
      ).to.be.revertedWith("BCX: reset to 0 first");
    });

    it("doit permettre de changer une allowance après reset à 0", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      // D'abord remettre à 0
      await bcx.approve(user1.address, 0);
      // Ensuite mettre la nouvelle valeur
      await bcx.approve(user1.address, ethers.parseUnits("1000", 18));
      expect(await bcx.allowance(owner.address, user1.address))
        .to.equal(ethers.parseUnits("1000", 18));
    });

    it("doit augmenter l'allowance avec increaseAllowance", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      await bcx.increaseAllowance(user1.address, montant);
      expect(await bcx.allowance(owner.address, user1.address))
        .to.equal(ethers.parseUnits("1000", 18));
    });

    it("doit diminuer l'allowance avec decreaseAllowance", async function () {
      const montant = ethers.parseUnits("500", 18);
      await bcx.approve(user1.address, montant);
      await bcx.decreaseAllowance(user1.address, ethers.parseUnits("200", 18));
      expect(await bcx.allowance(owner.address, user1.address))
        .to.equal(ethers.parseUnits("300", 18));
    });

  });

  // ============================================================
  // TEST 4 : LOCK-UP PIONEER
  // ============================================================
  describe("4. Lock-up Pioneer", function () {

    it("doit verrouiller les tokens d'un Pioneer", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      expect(await bcx.availableBalance(pioneer1.address)).to.equal(0);
    });

    it("doit retourner les bonnes infos de lock", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      const [lockedAmount, unlockTime] = await bcx.getLockInfo(pioneer1.address);
      expect(lockedAmount).to.equal(montant);
      expect(unlockTime).to.be.gt(0);
    });

    it("availableBalance doit être 0 pendant le lock", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      // Solde total existe mais disponible = 0
      expect(await bcx.balanceOf(pioneer1.address)).to.equal(montant);
      expect(await bcx.availableBalance(pioneer1.address)).to.equal(0);
    });

    it("doit bloquer le transfert pendant le lock", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      await expect(
        bcx.connect(pioneer1).transfer(user1.address, montant)
      ).to.be.revertedWith("BCX: amount exceeds available balance");
    });

    it("doit permettre le transfert après 12 mois", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      await time.increase(LOCK_DURATION + 1);
      await bcx.unlockTokens(pioneer1.address);
      await expect(
        bcx.connect(pioneer1).transfer(user1.address, montant)
      ).to.not.be.reverted;
    });

    it("doit refuser l'unlock avant 12 mois", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      await expect(
        bcx.unlockTokens(pioneer1.address)
      ).to.be.revertedWith("BCX: lock period not yet expired");
    });

    it("seul le owner peut verrouiller", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await expect(
        bcx.connect(user1).lockTokens(pioneer1.address, montant)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("ne peut pas verrouiller deux fois la même adresse", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, ethers.parseUnits("100000", 18));
      await expect(
        bcx.lockTokens(pioneer1.address, ethers.parseUnits("100000", 18))
      ).to.be.revertedWith("BCX: tokens already locked");
    });

  });

  // ============================================================
  // TEST 5 : BURN
  // ============================================================
  describe("5. Burn", function () {

    it("doit brûler des tokens et réduire le supply", async function () {
      const montant = ethers.parseUnits("1000", 18);
      const supplyAvant = await bcx.totalSupply();
      await bcx.burn(montant);
      expect(await bcx.totalSupply()).to.equal(supplyAvant - BigInt(montant));
    });

    it("doit réduire le solde du brûleur", async function () {
      const montant = ethers.parseUnits("1000", 18);
      const soldeAvant = await bcx.balanceOf(owner.address);
      await bcx.burn(montant);
      expect(await bcx.balanceOf(owner.address)).to.equal(soldeAvant - BigInt(montant));
    });

    it("ne peut pas brûler plus que le solde disponible", async function () {
      await expect(
        bcx.connect(user1).burn(ethers.parseUnits("1", 18))
      ).to.be.revertedWith("BCX: burn exceeds available balance");
    });

    it("ne peut pas brûler des tokens verrouillés", async function () {
      const montant = ethers.parseUnits("500000", 18);
      await bcx.transfer(pioneer1.address, montant);
      await bcx.lockTokens(pioneer1.address, montant);
      await expect(
        bcx.connect(pioneer1).burn(montant)
      ).to.be.revertedWith("BCX: burn exceeds available balance");
    });

  });

  // ============================================================
  // TEST 6 : BLACKLIST
  // ============================================================
  describe("6. Blacklist", function () {

    it("doit bloquer les transferts d'une adresse blacklistée", async function () {
      await bcx.transfer(attacker.address, ethers.parseUnits("100", 18));
      await bcx.setBlacklist(attacker.address, true);
      await expect(
        bcx.connect(attacker).transfer(user1.address, ethers.parseUnits("10", 18))
      ).to.be.revertedWith("BCX: sender is blacklisted");
    });

    it("doit bloquer les transferts vers une adresse blacklistée", async function () {
      await bcx.setBlacklist(attacker.address, true);
      await expect(
        bcx.transfer(attacker.address, ethers.parseUnits("10", 18))
      ).to.be.revertedWith("BCX: recipient is blacklisted");
    });

    it("seul le owner peut blacklister", async function () {
      await expect(
        bcx.connect(user1).setBlacklist(attacker.address, true)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("doit pouvoir retirer une adresse de la blacklist", async function () {
      await bcx.transfer(attacker.address, ethers.parseUnits("100", 18));
      await bcx.setBlacklist(attacker.address, true);
      await bcx.setBlacklist(attacker.address, false);
      // Maintenant le transfert doit marcher
      await expect(
        bcx.connect(attacker).transfer(user1.address, ethers.parseUnits("10", 18))
      ).to.not.be.reverted;
    });

    it("ne peut pas blacklister le owner", async function () {
      await expect(
        bcx.setBlacklist(owner.address, true)
      ).to.be.revertedWith("BCX: cannot blacklist owner");
    });

  });

  // ============================================================
  // TEST 7 : SÉCURITÉ OWNABLE
  // ============================================================
  describe("7. Sécurité Ownable", function () {

    it("doit transférer la propriété correctement", async function () {
      await bcx.transferOwnership(user1.address);
      expect(await bcx.getOwner()).to.equal(user1.address);
    });

    it("doit refuser BNB envoyé au contrat", async function () {
      await expect(
        owner.sendTransaction({
          to: await bcx.getAddress(),
          value: ethers.parseEther("1.0")
        })
      ).to.be.revertedWith("BCX: contract does not accept BNB");
    });

  });

});