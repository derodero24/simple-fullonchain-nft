//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract HelloNft is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("HelloNft", "HELLO") {}

    function mint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Got invalid token ID");
        string memory svg = getSVG(tokenId);
        bytes memory json = abi.encodePacked(
            '{"name": "HelloNFT #',
            Strings.toString(tokenId),
            '", "description": "HelloNFT is a full on-chain text NFT.", "image": "data:image/svg+xml;base64,',
            Base64.encode(bytes(svg)),
            '"}'
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(json)
                )
            );
    }

    function getSVG(uint256 tokenId) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg"'
                    'preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">'
                    "<style>text{fill:black;30px;font-family:serif;}</style>"
                    '<rect width="100%" height="100%" fill="#ccddcc" />'
                    '<text x="10%" y="30%" font-size="50px">HelloNFT</text>'
                    '<text x="10%" y="60%" font-size="30px">#',
                    Strings.toString(tokenId),
                    "</text></svg>"
                )
            );
    }
}
