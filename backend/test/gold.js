const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("GoldToken v2 - Full Test Suite", function () {
  let GoldToken, goldToken;
  let deployer, user;

  const sellPrice = ethers.parseEther("0.06");
  const buyPrice = ethers.parseEther("0.05");
  const inventory = ethers.parseUnits("1000000", 18);

  beforeEach(async function () {
    [deployer, user] = await ethers.getSigners();

    GoldToken = await ethers.getContractFactory("GoldToken");
    goldToken = await GoldToken.deploy(
      deployer.address,
      sellPrice,
      buyPrice,
      deployer.address
    );
    await goldToken.waitForDeployment();
  });

  // -----------------------------
  // Deployment & Setup
  // -----------------------------

  describe("Deployment & Setup", function () {
    it("should deploy with correct name, symbol and inventory", async function () {
      expect(await goldToken.name()).to.equal("Gold Token");
      expect(await goldToken.symbol()).to.equal("GLD");
      expect(await goldToken.balanceOf(goldToken.target)).to.equal(inventory);
    });

    it("should return correct prices", async function () {
      const [sell, buy] = await goldToken.getPrices();
      expect(sell).to.equal(sellPrice);
      expect(buy).to.equal(buyPrice);
    });
  });

  // -----------------------------
  // Public User Functions
  // -----------------------------

  describe("Public Functions - Buying and Selling", function () {
    it("should allow users to buy GLD", async function () {
      const value = ethers.parseEther("0.1");
      const expectedGLD = (value * BigInt(10 ** 18)) / sellPrice;

      await goldToken.connect(user).buyGold({ value });
      const userBalance = await goldToken.balanceOf(user.address);
      expect(userBalance).to.equal(expectedGLD);
    });

    it("should revert buying with too little ETH", async function () {
      await expect(
        goldToken.connect(user).buyGold({ value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("ETH sent is too low");
    });

    // it("should revert buying if contract has no inventory", async function () {
    //   const inventory = await goldToken.getGLDInventory();

    //   // Simulate draining the contract’s inventory
    //   await goldToken.connect(deployer).mintGLD(deployer.address, 0); // force internal state update
    //   await goldToken.connect(deployer).transfer(deployer.address, inventory); // use deployer since contract can't approve

    //   await expect(
    //     goldToken.connect(user).buyGold({ value: ethers.parseEther("0.1") })
    //   ).to.be.revertedWith("Insufficient GLD in contract");
    // });


    it("should allow users to sell GLD", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      const amount = await goldToken.balanceOf(user.address);

      const expectedEth = (buyPrice * amount) / BigInt(10 ** 18);

      await expect(() =>
        goldToken.connect(user).sellGold(amount)
      ).to.changeEtherBalances(
        [user, goldToken.target],
        [expectedEth, -expectedEth]
      );

    });

    it("should revert selling without GLD", async function () {
      await expect(
        goldToken.connect(user).sellGold(ethers.parseUnits("1", 18))
      ).to.be.revertedWith("Not enough GLD");
    });

    it("should revert selling if contract has no ETH", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      const amount = await goldToken.balanceOf(user.address);

      // Drain ETH from contract
      await network.provider.send("hardhat_setBalance", [
        goldToken.target,
        "0x0",
      ]);

      await expect(
        goldToken.connect(user).sellGold(amount)
      ).to.be.revertedWith("Insufficient ETH in contract");
    });
  });

  // -----------------------------
  // Admin Functions
  // -----------------------------

  describe("Admin Functions - Only Owner", function () {
    it("should allow owner to set prices", async function () {
      const newSell = ethers.parseEther("0.07");
      const newBuy = ethers.parseEther("0.06");

      await goldToken.setPrices(newSell, newBuy);
      const [s, b] = await goldToken.getPrices();
      expect(s).to.equal(newSell);
      expect(b).to.equal(newBuy);
    });

    it("should revert price update if not owner", async function () {
      await expect(
        goldToken.connect(user).setPrices(sellPrice, buyPrice)
      ).to.be.revertedWithCustomError(goldToken, "OwnableUnauthorizedAccount");
    });

    it("should allow owner to mint new GLD", async function () {
      const to = user.address;
      const amount = ethers.parseUnits("1000", 18);

      await goldToken.mintGLD(to, amount);
      expect(await goldToken.balanceOf(to)).to.equal(amount);
    });

    it("should revert minting to zero address", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await expect(
        goldToken.mintGLD(ethers.ZeroAddress, amount)
      ).to.be.revertedWith("Invalid address");
    });

    it("should allow redeemGoldFrom after user approval", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      const balance = await goldToken.balanceOf(user.address);
      await goldToken.connect(user).approve(deployer.address, balance);

      await expect(() =>
        goldToken.redeemGoldFrom(user.address, balance)
      ).to.changeTokenBalance(goldToken, user, -balance);
    });

    it("should revert redeemGoldFrom without approval", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      const balance = await goldToken.balanceOf(user.address);
      await expect(
        goldToken.redeemGoldFrom(user.address, balance)
      ).to.be.reverted;
    });
  });

  // -----------------------------
  // Utility Views
  // -----------------------------

  describe("Utility Views", function () {
    it("should return contract balance", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      const balance = await goldToken.getContractBalance();
      expect(balance).to.be.gt(0);
    });

    it("should return inventory and circulating supply correctly", async function () {
      const gldInventory = await goldToken.getGLDInventory();
      const circSupply = await goldToken.getCirculatingSupply();

      expect(gldInventory + circSupply).to.equal(await goldToken.totalSupply());
    });

    it("should return isFullyBacked true when no circulating tokens", async function () {
      const backed = await goldToken.isFullyBacked();
      expect(backed).to.equal(true);
    });

    it("should return isFullyBacked false if ETH backing is insufficient", async function () {
      const value = ethers.parseEther("0.1");
      await goldToken.connect(user).buyGold({ value });

      await network.provider.send("hardhat_setBalance", [
        goldToken.target,
        "0x0",
      ]);

      const backed = await goldToken.isFullyBacked();
      expect(backed).to.equal(false);
    });

    it("should approve GLD successfully", async function () {
      const amount = ethers.parseUnits("100", 18);
      await goldToken.connect(user).approve(deployer.address, amount);

      const allowance = await goldToken.allowance(user.address, deployer.address);
      expect(allowance).to.equal(amount);
    });
  });
});