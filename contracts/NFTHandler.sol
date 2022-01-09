// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTHandler is IERC721Receiver {
    
    function psTransferNFT(address _to, uint256 _tokenId, address _tokenContract) internal {
       ERC721 myContract = ERC721(_tokenContract);
       myContract.safeTransferFrom(address(this), _to, _tokenId);
    }
    
    event NFTRecieved(
        address from,
        uint256 tokenId,
        address operator,
        bytes data
    );
        
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes calldata _data
    ) public override returns (bytes4) {
        
        emit NFTRecieved(_from, _tokenId, _operator, _data); 
        
        return this.onERC721Received.selector;
    }
    
}