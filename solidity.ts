// SPDX-License-Identifier: MIT
export const SOLIDITY_CODE = `pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title EduVaultSBT
 * @dev Soulbound Token (SBT) implementation for Academic Degrees.
 *      Tokens are non-transferable and bound to the student's wallet.
 *      Uses on-chain hashing for privacy-preserving verification.
 */
contract EduVaultSBT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;

    // Mapping from token ID to the cryptographic hash of the credential data.
    mapping(uint256 => bytes32) public credentialHashes;
    
    // Mapping for granular attribute hashes (e.g., GPA range)
    mapping(uint256 => mapping(bytes32 => bool)) public attributeClaims;

    mapping(uint256 => string) private _tokenURIs;

    event DegreeMinted(address indexed student, uint256 indexed tokenId, bytes32 hash);

    constructor(address initialOwner) ERC721("EduVault Degree", "EVD") Ownable(initialOwner) {}

    function mintDegree(address student, string memory _tokenURI, bytes32 _hash) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        credentialHashes[tokenId] = _hash;

        emit DegreeMinted(student, tokenId, _hash);
        return tokenId;
    }
    
    function addAttributeClaim(uint256 tokenId, bytes32 claimHash) public onlyOwner {
        attributeClaims[tokenId][claimHash] = true;
    }

    function verifyHash(uint256 tokenId, bytes32 providedHash) public view returns (bool) {
        return credentialHashes[tokenId] == providedHash;
    }
    
    function verifyAttribute(uint256 tokenId, bytes32 claimHash) public view returns (bool) {
        return attributeClaims[tokenId][claimHash];
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("EduVaultSBT: Soulbound tokens cannot be transferred");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("EduVaultSBT: Soulbound tokens cannot be transferred");
    }
}`;