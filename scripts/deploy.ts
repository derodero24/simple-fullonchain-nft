import { ethers } from 'hardhat';

async function main() {
  const HelloNft = await ethers.getContractFactory('HelloNft');
  const helloNft = await HelloNft.deploy();
  await helloNft.deployed();
  console.log('HelloNft deployed to:', helloNft.address);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
