// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

interface ITarget {
  function mintToken(uint256 quantity) external payable;
}

contract NFTMinter is IERC721Receiver {
  address public owner;
  address public realOwner;
  bool public isBase;
  address public NFT;
  modifier onlyOwner() {
    require(msg.sender == owner, "ERROR: only owner");
    _;
  }

  constructor() {
    isBase = true;
  }

  function initialize(address _owner, address _NFT, address _realowner) external {
    require(isBase == false, "ERROR: This is the base contract, cannot initialize");
    require(owner == address(0), "ERROR: Contract alreay initialized");
    owner = _owner;
    NFT = _NFT;
    realOwner = _realowner;
  }
  function mint(uint256 amount) external payable onlyOwner{
    ITarget(NFT).mintToken{value: msg.value}(amount);
  }
  function withdraw(uint256 tokenID) external onlyOwner{
    IERC721(NFT).transferFrom(address(this), realOwner, tokenID);
  }
  event Received();

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
    override
    returns(bytes4)
  {
    _operator;
    _from;
    _tokenId;
    _data;
    emit Received();
    return 0x150b7a02;
  }
}