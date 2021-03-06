import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HelloNft } from '../typechain-types';

describe('HelloNft', () => {
  let helloNft: HelloNft;
  let owner: SignerWithAddress;

  before(async () => {
    // deploy NFT
    const HelloNft = await ethers.getContractFactory('HelloNft');
    helloNft = await HelloNft.deploy();
    await helloNft.deployed();
    [owner] = await ethers.getSigners();
  });

  it('Check NFT info', async () => {
    expect(await helloNft.name()).to.equal('HelloNft');
    expect(await helloNft.symbol()).to.equal('HELLO');
  });

  it('Mint to owner', async () => {
    await helloNft.mint(owner.address);
    expect(await helloNft.ownerOf(0)).to.equal(owner.address);
  });

  it('get tokenURI', async () => {
    console.log(await helloNft.tokenURI(0));
  });
});
