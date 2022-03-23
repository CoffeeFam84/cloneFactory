import { expect } from "chai";
import { exec } from "child_process";
import { ethers } from "hardhat";
import { MinterFactory } from "../typechain";

describe("MinterFactory", function () {
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const HappyHomies = await ethers.getContractFactory("happyHomies");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    console.log("deploying happyHomies ... ");
    const happyHomies = await HappyHomies.deploy();
    await happyHomies.deployed();
    console.log("happyHomies address = ", happyHomies.address);

    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const totalSupply = await happyHomies.totalSupply();
    expect(totalSupply).to.be.equal(6);
    console.log("totalSupply = ", totalSupply);

    console.log("setting saleActive to true ... ");
    let tx = await happyHomies.setSaleActive(true);
    await tx.wait();
    const saleActive = await happyHomies.saleActive();
    expect(saleActive).to.be.equal(true);
    console.log("saleActive = ", saleActive);

    console.log("owner is minting 2 ntfs ...");
    tx = await happyHomies.mintToken(2, { value: "2000000000000000" });
    await tx.wait();
    const bal = await happyHomies.publicsaleAddressMinted(owner.address);
    expect(bal).to.be.equal(2);
    console.log("bal = ", bal);

    console.log("deploying NFTMinter ... ");
    const NFTMinter = await NFTMinterFactory.deploy();
    await NFTMinter.deployed();
    console.log("NFTMinter address = ", NFTMinter.address);

    const owner0 = await happyHomies.ownerOf(1);
    console.log("owner of token 0 is ", owner0);

    const owner5 = await happyHomies.ownerOf(7);
    expect(owner5).to.be.equal(owner.address);

    console.log("deploying MinterFactory ...");
    const MinterFactory = await MinterFactoryFactory.deploy(
      NFTMinter.address,
      happyHomies.address
    );
    await MinterFactory.deployed();
    console.log("MinterFactory address = ", MinterFactory.address);

    expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    expect(await MinterFactory.NFT()).to.be.equal(happyHomies.address);

    console.log("cloning one ...");
    tx = await MinterFactory._clone();
    await tx.wait();

    const cloned = await MinterFactory.returnClones(owner.address);
    console.log("cloned Minter address = ", cloned);

    const minter = await MinterFactory.minter();
    console.log("minter = ", minter);

    const Nft = await MinterFactory.NFT();
    console.log("Nft = ", Nft);

    console.log("minting 2 nfts by cloned minter ... ");
    tx = await MinterFactory.mint(2, 0, { value: "2000000000000000" });
    await tx.wait();

    const bal0 = await happyHomies.balanceOf(owner.address);
    expect(bal0).to.be.equal(2);
    console.log("cloned minter now has %d nfts", bal0);

    console.log("withdrawing cloned minter's nft ...");
    tx = await MinterFactory.withdraw(0, 9, owner.address);
    await tx.wait();
    const balowner = await happyHomies.balanceOf(owner.address);
    console.log("balance of owner is now %d", balowner);
    expect(balowner).to.be.equal(3);
  });
  it("Should clone and mint", async function () {
    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const HappyHomies = await ethers.getContractFactory("happyHomies");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    console.log("deploying happyHomies ... ");
    const happyHomies = await HappyHomies.deploy();
    await happyHomies.deployed();
    console.log("happyHomies address = ", happyHomies.address);

    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const totalSupply = await happyHomies.totalSupply();
    expect(totalSupply).to.be.equal(6);
    console.log("totalSupply = ", totalSupply);

    console.log("setting saleActive to true ... ");
    let tx = await happyHomies.setSaleActive(true);
    await tx.wait();
    const saleActive = await happyHomies.saleActive();
    expect(saleActive).to.be.equal(true);
    console.log("saleActive = ", saleActive);

    console.log("owner is minting 2 ntfs ...");
    tx = await happyHomies.mintToken(2, { value: "2000000000000000" });
    await tx.wait();
    const bal = await happyHomies.publicsaleAddressMinted(owner.address);
    expect(bal).to.be.equal(2);
    console.log("bal = ", bal);

    console.log("deploying NFTMinter ... ");
    const NFTMinter = await NFTMinterFactory.deploy();
    await NFTMinter.deployed();
    console.log("NFTMinter address = ", NFTMinter.address);

    const owner0 = await happyHomies.ownerOf(1);
    console.log("owner of token 0 is ", owner0);

    const owner5 = await happyHomies.ownerOf(7);
    expect(owner5).to.be.equal(owner.address);

    console.log("deploying MinterFactory ...");
    const MinterFactory = await MinterFactoryFactory.deploy(
      NFTMinter.address,
      happyHomies.address
    );
    await MinterFactory.deployed();
    console.log("MinterFactory address = ", MinterFactory.address);

    expect(await MinterFactory.minter()).to.be.equal(NFTMinter.address);
    expect(await MinterFactory.NFT()).to.be.equal(happyHomies.address);

    console.log("batch cloning and minting 50 ...")
    tx = await MinterFactory.connect(addr1).batchCloneAndMint(50, {value: "50000000000000000"});
    await tx.wait();

    const clones = await MinterFactory.returnClones(addr1.address);
    console.log("cloned addresses = ", clones);

    expect(clones.length).to.be.equal(50);

    console.log("batchWithdrawing 10 to owner ... ");
    tx = await MinterFactory.connect(addr1).batchWithdraw(10, owner.address);
    await tx.wait();

    const balace = await happyHomies.balanceOf(owner.address);
    expect(balace).to.be.equal(12);

  });
});
