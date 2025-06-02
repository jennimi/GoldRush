const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GoldToken Contract", function () {
    let goldToken;
    let owner, sellerWallet, buyer, other;

    // Constants: assume GLD has 18 decimals.
    const DECIMALS = 18;
    // oneToken represents 1 GLD = 1e18 units.
    const oneToken = ethers.parseUnits("1", DECIMALS);
    // Define sellPrice = 0.6 ETH and buyPrice = 0.58 ETH.
    const sellPrice = ethers.parseUnits("0.6", DECIMALS);
    const buyPrice = ethers.parseUnits("0.58", DECIMALS);

    beforeEach(async function () {
        // Get signers.
        [owner, sellerWallet, buyer, other] = await ethers.getSigners();

        const GoldTokenFactory = await ethers.getContractFactory("GoldToken");
        goldToken = await GoldTokenFactory.deploy(
            sellerWallet.address,
            sellPrice,
            buyPrice,
            owner.address
        );
        // Wait for the contract deployment using ethers v6 syntax.
        await goldToken.waitForDeployment();
        console.log("GoldToken deployed to:", goldToken.target);
    });

    describe("Deployment", function () {
        it("should correctly set the sellerWallet, sellPrice, and buyPrice", async function () {
            const contractSellerWallet = await goldToken.sellerWallet();
            expect(contractSellerWallet).to.equal(sellerWallet.address);

            const contractSellPrice = await goldToken.sellPrice();
            const contractBuyPrice = await goldToken.buyPrice();
            expect(contractSellPrice).to.equal(sellPrice);
            expect(contractBuyPrice).to.equal(buyPrice);
        });

        it("should have an initial GLD inventory of 1 million tokens", async function () {
            // The contract holds its inventory at its own address.
            // In ethers v6, use goldToken.target (or alternatively await goldToken.getAddress()).
            const contractInventory = await goldToken.balanceOf(goldToken.target);
            const expectedInventory = 1000000n * oneToken;
            expect(contractInventory).to.equal(expectedInventory);
        });
    });

    describe("buyGold Function", function () {
        it("should allow a user to buy GLD by sending the correct ETH amount", async function () {
            // Buyer starts with a zero GLD balance.
            expect(await goldToken.balanceOf(buyer.address)).to.equal(0n);

            // Call buyGold and expect it to emit the "GoldPurchased" event.
            await expect(
                goldToken.connect(buyer).buyGold({ value: sellPrice })
            ).to.emit(goldToken, "GoldPurchased");

            // After buying, the buyer's balance should be oneToken.
            expect(await goldToken.balanceOf(buyer.address)).to.equal(oneToken);
        });

        it("should revert if an incorrect ETH amount is sent", async function () {
            const wrongValue = ethers.parseUnits("0.1", DECIMALS);
            await expect(
                goldToken.connect(buyer).buyGold({ value: wrongValue })
            ).to.be.revertedWith("Incorrect ETH amount");
        });
    });

    describe("sellGold Function", function () {
        beforeEach(async function () {
            // Buyer purchases 1 GLD before selling.
            await goldToken.connect(buyer).buyGold({ value: sellPrice });
        });

        it("should allow a user to sell their GLD tokens", async function () {
            await expect(
                goldToken.connect(buyer).sellGold(oneToken)
            ).to.emit(goldToken, "GoldSold");

            // After selling, the buyer's GLD balance should be 0.
            expect(await goldToken.balanceOf(buyer.address)).to.equal(0n);
        });

        it("should revert if the user does not have enough GLD tokens", async function () {
            // 'other' has no tokens.
            await expect(
                goldToken.connect(other).sellGold(oneToken)
            ).to.be.revertedWith("Not enough GLD");
        });
    });

    describe("setPrices Function", function () {
        it("should allow the owner to update the prices", async function () {
            const newSellPrice = ethers.parseUnits("0.7", DECIMALS);
            const newBuyPrice = ethers.parseUnits("0.65", DECIMALS);
            await expect(
                goldToken.connect(owner).setPrices(newSellPrice, newBuyPrice)
            )
                .to.emit(goldToken, "PricesUpdated")
                .withArgs(newSellPrice, newBuyPrice);

            expect(await goldToken.sellPrice()).to.equal(newSellPrice);
            expect(await goldToken.buyPrice()).to.equal(newBuyPrice);
        });

        it("should revert when a non-owner attempts to update the prices", async function () {
            const newSellPrice = ethers.parseUnits("0.7", DECIMALS);
            const newBuyPrice = ethers.parseUnits("0.65", DECIMALS);
            await expect(
                goldToken.connect(buyer).setPrices(newSellPrice, newBuyPrice)
            ).to.be.reverted;
        });
    });

    describe("Utility Functions", function () {
        it("getPrices() should return the correct sellPrice and buyPrice", async function () {
            const [pSellPrice, pBuyPrice] = await goldToken.getPrices();
            expect(pSellPrice).to.equal(sellPrice);
            expect(pBuyPrice).to.equal(buyPrice);
        });

        it("getContractBalance() should return the contract's ETH balance", async function () {
            // After a purchase, the contract will hold buyPrice worth of ETH.
            await goldToken.connect(buyer).buyGold({ value: sellPrice });
            const contractBalance = await goldToken.getContractBalance();
            expect(contractBalance).to.equal(buyPrice);
        });

        it("getGLDInventory() should return the number of tokens held by the contract", async function () {
            const inventory = await goldToken.getGLDInventory();
            const expectedInventory = 1000000n * oneToken;
            expect(inventory).to.equal(expectedInventory);
        });

        it("getCirculatingSupply() should return the number of tokens in circulation", async function () {
            // Initially, circulating supply is 0.
            expect(await goldToken.getCirculatingSupply()).to.equal(0n);
            // After a purchase, circulating supply should equal oneToken.
            await goldToken.connect(buyer).buyGold({ value: sellPrice });
            expect(await goldToken.getCirculatingSupply()).to.equal(oneToken);
        });

        // it("isFullyBacked() should return true if the contract's ETH balance is sufficient", async function () {
        //   // Initially, it should return false (no ETH held).
        //   expect(await goldToken.isFullyBacked()).to.equal(false);
        //   // After a purchase, the contract's balance equals the backing value.
        //   await goldToken.connect(buyer).buyGold({ value: sellPrice });
        //   expect(await goldToken.isFullyBacked()).to.equal(true);
        // });
    });

    describe("redeemGoldFrom Function", function () {
        beforeEach(async function () {
            // Buyer purchases a token.
            await goldToken.connect(buyer).buyGold({ value: sellPrice });
        });

        it("should allow the owner to redeem (burn) a user's GLD tokens", async function () {
            await expect(
                goldToken.connect(owner).redeemGoldFrom(buyer.address, oneToken)
            ).to.emit(goldToken, "GoldRedeemed");
            expect(await goldToken.balanceOf(buyer.address)).to.equal(0n);
        });

        it("should revert if a non-owner attempts to redeem tokens", async function () {
            await expect(
                goldToken.connect(buyer).redeemGoldFrom(buyer.address, oneToken)
            ).to.be.reverted;
        });
    });

    describe("mintGLD Function", function () {
        it("should allow the owner to mint new GLD tokens", async function () {
            // Use native BigInt arithmetic for the mint amount.
            const mintAmount = oneToken * 10n;
            await expect(
                goldToken.connect(owner).mintGLD(buyer.address, mintAmount)
            )
                .to.emit(goldToken, "GLDMinted")
                .withArgs(buyer.address, mintAmount);
            expect(await goldToken.balanceOf(buyer.address)).to.equal(mintAmount);
        });

        it("should revert when trying to mint tokens to the zero address", async function () {
            const mintAmount = oneToken * 10n;
            await expect(
                goldToken.connect(owner).mintGLD("0x0000000000000000000000000000000000000000", mintAmount)
            ).to.be.revertedWith("Invalid address");
        });
    });

    describe("approveGLD Function", function () {
        it("should correctly set the allowance for a spender", async function () {
            const approveAmount = oneToken * 5n;
            await expect(
                goldToken.connect(owner).approveGLD(buyer.address, approveAmount)
            ).to.emit(goldToken, "Approval");
            expect(await goldToken.allowance(owner.address, buyer.address)).to.equal(approveAmount);
        });
    });
});