// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import 'hardhat/console.sol';

interface INFTMinter {
    function initialize(address _owner, address _NFT) external;
    function mint(uint amount) external payable;
    function withdraw(uint256 tokenID, address to) external;
    function getTokenID() external view returns(uint256);
}

interface INFT {
    function totalSupply() external view returns(uint256);
    function price() external view returns(uint256);
    function balanceOf(address owner) external view returns(uint256);
}

contract MinterFactory is Ownable {
    address public minter;
    address public NFT;
    mapping(address=>address[]) public allClones;
    
    event NewClone(address _newClone, address _owner);

    using Clones for address;

    constructor(address _minter, address _NFT) {
        console.log("MinterFactory: NFT = ", _NFT);
        console.log("MinterFactory: minter = ", _minter);
        minter = _minter;
        NFT = _NFT;
    }

    function batchCloneAndMint(uint256 amount) external payable{
        require(INFT(NFT).totalSupply() + amount <= 10000, "MinterFactory: amount exceeds");
        require(INFT(NFT).price() * amount <= msg.value);
        for (uint256 i = 0; i < amount; i++){
            address indenticalChild = minter.clone();
            allClones[msg.sender].push(indenticalChild);
            INFTMinter(indenticalChild).initialize(address(this), NFT);
            emit NewClone(indenticalChild, msg.sender);
            INFTMinter(indenticalChild).mint{value: INFT(NFT).price()}(1);
        }
    }

    function batchWithdraw(uint256 amount, address to) external{
        uint256 balance = 0;
        for (uint256 i = 0; i < allClones[msg.sender].length; i++){
            balance += INFT(NFT).balanceOf(allClones[msg.sender][i]);
        }
        require(balance >= amount, "MinterFactory: balance lack");
        uint256 withdrawed = 0;
        for (uint256 i = 0; i < allClones[msg.sender].length; i++){
            if (withdrawed == amount) break;
            uint256 id = INFTMinter(allClones[msg.sender][i]).getTokenID();
            if(id > 0) {
                INFTMinter(allClones[msg.sender][i]).withdraw(id, to);
                withdrawed++;
            }
        }
    }

    function _clone() external {
        address indenticalChild = minter.clone();
        allClones[msg.sender].push(indenticalChild);
        INFTMinter(indenticalChild).initialize(address(this), NFT);
        emit NewClone(indenticalChild, msg.sender);
    }

    function returnClones(address owner) external view returns(address[] memory) {
        return allClones[owner];
    }

    function mint(uint256 amount, uint256 minterIndex) external payable{
        INFTMinter(allClones[msg.sender][minterIndex]).mint{value: msg.value}(amount);
    }

    function withdraw(uint256 minterIndex, uint256 tokenID, address to) public {
        INFTMinter(allClones[msg.sender][minterIndex]).withdraw(tokenID, to);
    }
}
