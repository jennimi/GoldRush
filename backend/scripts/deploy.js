const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying contract with account:", deployer.address);

  const GoldToken = await hre.ethers.getContractFactory("GoldToken");

  const contract = await GoldToken.deploy(
    deployer.address,                           // sellerWallet
    hre.ethers.parseEther("0.06"),              // initial sellPrice
    hre.ethers.parseEther("0.05"),              // initial buyPrice
    deployer.address                            // initialOwner
  );

  await contract.waitForDeployment();

  console.log("✅ GoldToken deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
