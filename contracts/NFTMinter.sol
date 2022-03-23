// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
// import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';

interface ITarget {
  function mintToken(uint256 quantity) external payable;
  function ownerOf(uint256) external view returns(address);
  function totalSupply() external view returns(uint256);
}
interface IERC721{
  function transferFrom(address from, address to, uint256 id) external;
}

contract NFTMinter {
  address public owner;
  bool public isBase;
  address public NFT;
  modifier onlyOwner() {
    require(msg.sender == owner, "ERROR: only owner");
    _;
  }

  constructor() {
    isBase = true;
  }

  function initialize(address _owner, address _NFT) external {
    require(isBase == false, "ERROR: This is the base contract, cannot initialize");
    require(owner == address(0), "ERROR: Contract alreay initialized");
    owner = _owner;
    NFT = _NFT;
  }
  function mint(uint256 amount) external payable onlyOwner{
    ITarget(NFT).mintToken{value: msg.value}(amount);
  }
  function withdraw(uint256 tokenID, address to) external onlyOwner{
    IERC721(NFT).transferFrom(address(this), to, tokenID);
  }
  function getTokenID() external returns(uint256 id){
    for(uint256 i = 1; i <= ITarget(NFT).totalSupply(); i++){
      if(ITarget(NFT).ownerOf(i) == address(this)) {
        id = i;
        break;
      }
    }
  }
  event Received();

  function onERC721Received(
    address _operator,
    address _from,
    uint256 _tokenId,
    bytes calldata _data
  )
    external
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