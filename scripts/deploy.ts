   
import { ethers } from "hardhat";

async function main() {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    const HappyHomies = await ethers.getContractFactory("happyHomies");
    const MinterFactoryFactory = await ethers.getContractFactory(
      "MinterFactory"
    );
    console.log("deploying happyHomies ... ");
    const happyHomies = await HappyHomies.deploy();
    await happyHomies.deployed();
    console.log("happyHomies address = ", happyHomies.address);

    console.log("setting saleActive to true ... ");
    let tx = await happyHomies.setSaleActive(true);
    await tx.wait();
    const saleActive = await happyHomies.saleActive();
    console.log("saleActive = ", saleActive);
 
    console.log("deploying NFTMinter ... ");
    const NFTMinter = await NFTMinterFactory.deploy();
    await NFTMinter.deployed();
    console.log("NFTMinter address = ", NFTMinter.address);

    console.log("deploying MinterFactory ...");
    const MinterFactory = await MinterFactoryFactory.deploy(
      NFTMinter.address,
      happyHomies.address
    );
    await MinterFactory.deployed();
    console.log("MinterFactory address = ", MinterFactory.address);

    console.log("batch cloning and minting 50 ...")
    tx = await MinterFactory.batchCloneAndMint(50, {value: "50000000000000000"});
    await tx.wait();

    const clones = await MinterFactory.returnClones(owner.address);
    console.log("cloned addresses = ", clones);

    console.log("batchWithdrawing 10 to owner ... ");
    tx = await MinterFactory.batchWithdraw(10, owner.address);
    await tx.wait();

    const bal = await happyHomies.balanceOf(owner.address);
    console.log("bal = ", bal.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });