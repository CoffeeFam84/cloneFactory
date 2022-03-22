// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import 'hardhat/console.sol';

interface INFTMinter {
    function initialize(address _owner, address _NFT, address _realowner) external;
    function mint(uint amount) external payable;
    function withdraw(uint256 tokenID) external;
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

    function _clone() external {
        address indenticalChild = minter.clone();
        allClones[msg.sender].push(indenticalChild);
        INFTMinter(indenticalChild).initialize(address(this), NFT, msg.sender);
        emit NewClone(indenticalChild, msg.sender);
    }

    function returnClones(address owner) external view returns(address[] memory) {
        return allClones[owner];
    }

    function mint(uint256 amount, uint256 minterIndex) external payable{
        INFTMinter(allClones[msg.sender][minterIndex]).mint{value: msg.value}(amount);
    }

    function withdraw(uint256 minterIndex, uint256 tokenID) public {
        INFTMinter(allClones[msg.sender][minterIndex]).withdraw(tokenID);
    }
}
