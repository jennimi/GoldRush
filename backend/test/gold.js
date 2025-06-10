const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("GoldToken - Simplified Test Suite", function () {
  let GoldToken, goldToken;
  let deployer, user;

  const sellPrice = ethers.parseEther("0.06");
  const buyPrice = ethers.parseEther("0.05");

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
  // 1. Deployment
  // -----------------------------
  it("should deploy with correct name, symbol and inventory", async function () {
    expect(await goldToken.name()).to.equal("Gold Token");
    expect(await goldToken.symbol()).to.equal("GLD");
    const inventory = await goldToken.balanceOf(goldToken.target);
    expect(inventory).to.be.gt(0);
  });

  // -----------------------------
  // 2. Public Use
  // -----------------------------
  it("should allow users to buy GLD", async function () {
    const value = ethers.parseEther("0.1");
    const expectedGLD = (value * BigInt(10 ** 18)) / sellPrice;
    await goldToken.connect(user).buyGold({ value });
    const userBalance = await goldToken.balanceOf(user.address);
    expect(userBalance).to.equal(expectedGLD);
  });

  it("should allow users to sell GLD", async function () {
    const value = ethers.parseEther("0.1");
    await goldToken.connect(user).buyGold({ value });
    const amount = await goldToken.balanceOf(user.address);
    const expectedEth = (buyPrice * amount) / BigInt(10 ** 18);

    await goldToken.connect(user).approve(goldToken.target, amount);
    await expect(() =>
      goldToken.connect(user).sellGold(amount)
    ).to.changeEtherBalances(
      [user, goldToken.target],
      [expectedEth, -expectedEth]
    );
  });

  it("should allow user to approve GLD", async function () {
    const amount = ethers.parseUnits("100", 18);
    await goldToken.connect(user).approve(deployer.address, amount);
    const allowance = await goldToken.allowance(user.address, deployer.address);
    expect(allowance).to.equal(amount);
  });

  // -----------------------------
  // 3. Admin Use
  // -----------------------------
  it("should allow owner to set prices", async function () {
    const newSell = ethers.parseEther("0.07");
    const newBuy = ethers.parseEther("0.06");
    await goldToken.setPrices(newSell, newBuy);
    const [s, b] = await goldToken.getPrices();
    expect(s).to.equal(newSell);
    expect(b).to.equal(newBuy);
  });

  it("should allow owner to mint GLD", async function () {
    const amount = ethers.parseUnits("1000", 18);
    await goldToken.mintGLD(user.address, amount);
    const balance = await goldToken.balanceOf(user.address);
    expect(balance).to.equal(amount);
  });

  it("should allow owner to burn GLD from user when redeeming", async function () {
    const value = ethers.parseEther("0.1");
    await goldToken.connect(user).buyGold({ value });
    const balance = await goldToken.balanceOf(user.address);
    await goldToken.connect(user).approve(deployer.address, balance);
    await expect(() =>
      goldToken.redeemGoldFrom(user.address, balance)
    ).to.changeTokenBalance(goldToken, user, -balance);
  });

  // -----------------------------
  // 4. Utility Use
  // -----------------------------
  it("should return correct prices", async function () {
    const [sell, buy] = await goldToken.getPrices();
    expect(sell).to.equal(sellPrice);
    expect(buy).to.equal(buyPrice);
  });

  it("should return contract ETH balance", async function () {
    const value = ethers.parseEther("0.1");
    await goldToken.connect(user).buyGold({ value });
    const balance = await goldToken.getContractBalance();
    expect(balance).to.be.gt(0);
  });

  it("should return GLD inventory from contract", async function () {
    const inventory = await goldToken.getGLDInventory();
    expect(inventory).to.be.gt(0);
  });

  it("should verify if contract is fully backed", async function () {
    const backed = await goldToken.isFullyBacked();
    expect(backed).to.be.true;
  });
});