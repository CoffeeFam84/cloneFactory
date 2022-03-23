   
import { ethers } from "hardhat";

async function main() {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // const NFTMinterFactory = await ethers.getContractFactory("NFTMinter");
    // const HappyHomies = await ethers.getContractFactory("happyHomies");
    // const MinterFactoryFactory = await ethers.getContractFactory(
    //   "MinterFactory"
    // );
    // console.log("deploying happyHomies ... ");
    // const happyHomies = await HappyHomies.deploy();
    // await happyHomies.deployed();
    // console.log("happyHomies address = ", happyHomies.address);

    // console.log("setting saleActive to true ... ");
    // let tx = await happyHomies.setSaleActive(true);
    // await tx.wait();
    // const saleActive = await happyHomies.saleActive();
    // console.log("saleActive = ", saleActive);
 
    // console.log("deploying NFTMinter ... ");
    // const NFTMinter = await NFTMinterFactory.deploy();
    // await NFTMinter.deployed();
    // console.log("NFTMinter address = ", NFTMinter.address);

    // console.log("deploying MinterFactory ...");
    // const MinterFactory = await MinterFactoryFactory.deploy(
    //   NFTMinter.address,
    //   happyHomies.address
    // );
    // await MinterFactory.deployed();
    // console.log("MinterFactory address = ", MinterFactory.address);

    const happyhommiesaddress = "0x69e627F734c54f6702f49ce6F4F0BE250D74397a";
    const NFTMiterAddress = "0x62A82daeE89A43ece5Eb5dfCB7C627E13e3eb1CC";
    const MinterFactoryaddresss = "0xF467e34ee39C29Fb2dcAC593F4eD333D3877dC24";

    const happyHomies = await ethers.getContractAt("happyHomies", happyhommiesaddress);
    const NFTMinter = await ethers.getContractAt("NFTMinter", NFTMiterAddress);
    const MinterFactory = await ethers.getContractAt("MinterFactory", MinterFactoryaddresss);

    console.log("batchminting one ... ")
    let tx = await MinterFactory.batchCloneAndMint(1, {value: "1000000000000000"});
    await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });