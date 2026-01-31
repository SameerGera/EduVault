const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const EduVaultSBT = await hre.ethers.getContractFactory("EduVaultSBT");
  // Pass the deployer's address as initialOwner to the constructor
  const eduVault = await EduVaultSBT.deploy(deployer.address);

  await eduVault.waitForDeployment();

  console.log("EduVaultSBT deployed to:", await eduVault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});