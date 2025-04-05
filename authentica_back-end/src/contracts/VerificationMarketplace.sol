// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Authentica Verification Marketplace
 * @dev A marketplace for AI content verification and NFT minting
 */
contract VerificationMarketplace is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Token addresses for payment
    address public wrdTokenAddress;
    address public usdcTokenAddress;
    
    // Platform fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeePercentage = 500; // 5%
    
    // Verification provider struct
    struct Provider {
        address payable wallet;
        uint256 price;  // Price in native token (ETH or RSK)
        uint256 tokenPrice;  // Price in WRD or USDC
        bool isActive;
    }
    
    // Verification request struct
    struct VerificationRequest {
        string ipfsContentHash;
        address user;
        bool isVerified;
        bool isHumanWritten;
        uint256 confidenceScore;
        bool isCompleted;
    }
    
    // Store providers by ID
    mapping(string => Provider) public providers;
    
    // Store verification requests
    mapping(bytes32 => VerificationRequest) public verificationRequests;
    
    // Events
    event ProviderRegistered(string providerId, address wallet, uint256 price);
    event VerificationRequested(bytes32 requestId, string providerId, string ipfsContentHash, address user);
    event VerificationCompleted(bytes32 requestId, bool isHumanWritten, uint256 confidenceScore);
    event NFTMinted(address to, uint256 tokenId, string ipfsContentHash);
    
    /**
     * @dev Constructor
     */
    constructor(address _wrdTokenAddress, address _usdcTokenAddress) 
        ERC721("Authentica Certificate", "AUTH") 
        Ownable(msg.sender) 
    {
        wrdTokenAddress = _wrdTokenAddress;
        usdcTokenAddress = _usdcTokenAddress;
    }
    
    /**
     * @dev Register a new provider
     */
    function registerProvider(
        string calldata providerId, 
        address payable wallet, 
        uint256 price,
        uint256 tokenPrice
    ) external onlyOwner {
        providers[providerId] = Provider({
            wallet: wallet,
            price: price,
            tokenPrice: tokenPrice,
            isActive: true
        });
        
        emit ProviderRegistered(providerId, wallet, price);
    }
    
    /**
     * @dev Request verification using native token (ETH/RSK)
     */
    function requestVerification(string calldata providerId, string calldata ipfsContentHash) 
        external 
        payable 
        returns (bytes32) 
    {
        Provider storage provider = providers[providerId];
        require(provider.isActive, "Provider is not active");
        require(msg.value >= provider.price, "Insufficient payment");
        
        bytes32 requestId = keccak256(abi.encodePacked(providerId, ipfsContentHash, msg.sender, block.timestamp));
        
        verificationRequests[requestId] = VerificationRequest({
            ipfsContentHash: ipfsContentHash,
            user: msg.sender,
            isVerified: false,
            isHumanWritten: false,
            confidenceScore: 0,
            isCompleted: false
        });
        
        // Calculate fees
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 providerPayment = msg.value - platformFee;
        
        // Transfer payments
        (bool platformSuccess, ) = owner().call{value: platformFee}("");
        require(platformSuccess, "Platform fee transfer failed");
        
        (bool providerSuccess, ) = provider.wallet.call{value: providerPayment}("");
        require(providerSuccess, "Provider payment failed");
        
        emit VerificationRequested(requestId, providerId, ipfsContentHash, msg.sender);
        
        return requestId;
    }
    
    /**
     * @dev Request verification using token (WRD or USDC)
     */
    function requestVerificationWithToken(
        string calldata providerId, 
        string calldata ipfsContentHash,
        bool useWrd
    ) external returns (bytes32) {
        Provider storage provider = providers[providerId];
        require(provider.isActive, "Provider is not active");
        
        IERC20 token;
        if (useWrd) {
            token = IERC20(wrdTokenAddress);
        } else {
            token = IERC20(usdcTokenAddress);
        }
        
        // Calculate fees
        uint256 platformFee = (provider.tokenPrice * platformFeePercentage) / 10000;
        uint256 providerPayment = provider.tokenPrice - platformFee;
        
        // Transfer tokens from user to this contract
        require(token.transferFrom(msg.sender, address(this), provider.tokenPrice), "Token transfer failed");
        
        // Transfer tokens to provider and platform
        require(token.transfer(provider.wallet, providerPayment), "Provider payment failed");
        require(token.transfer(owner(), platformFee), "Platform fee transfer failed");
        
        bytes32 requestId = keccak256(abi.encodePacked(providerId, ipfsContentHash, msg.sender, block.timestamp));
        
        verificationRequests[requestId] = VerificationRequest({
            ipfsContentHash: ipfsContentHash,
            user: msg.sender,
            isVerified: false,
            isHumanWritten: false,
            confidenceScore: 0,
            isCompleted: false
        });
        
        emit VerificationRequested(requestId, providerId, ipfsContentHash, msg.sender);
        
        return requestId;
    }
    
    /**
     * @dev Submit verification result (called by backend)
     */
    function submitVerificationResult(
        bytes32 requestId, 
        bool isHumanWritten, 
        uint256 confidenceScore
    ) external onlyOwner {
        VerificationRequest storage request = verificationRequests[requestId];
        require(!request.isCompleted, "Verification already completed");
        
        request.isVerified = true;
        request.isHumanWritten = isHumanWritten;
        request.confidenceScore = confidenceScore;
        request.isCompleted = true;
        
        emit VerificationCompleted(requestId, isHumanWritten, confidenceScore);
        
        // Mint NFT if human written with high confidence
        if (isHumanWritten && confidenceScore >= 9500) { // 95%
            _mintNFT(request.user, request.ipfsContentHash);
        }
    }
    
    /**
     * @dev Mint NFT for verified human content
     */
    function _mintNFT(address to, string memory ipfsContentHash) internal {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(to, newItemId);
        
        // Set token URI to IPFS hash of metadata
        string memory tokenURI = string(abi.encodePacked("ipfs://", ipfsContentHash));
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTMinted(to, newItemId, ipfsContentHash);
    }
    
    /**
     * @dev Allow user to mint NFT manually if verification passed threshold
     */
    function mintNFT(bytes32 requestId) external {
        VerificationRequest storage request = verificationRequests[requestId];
        require(request.isCompleted, "Verification not completed");
        require(request.user == msg.sender, "Not the request owner");
        require(request.isHumanWritten, "Content not verified as human-written");
        require(request.confidenceScore >= 9500, "Confidence score too low");
        
        _mintNFT(msg.sender, request.ipfsContentHash);
    }
    
    /**
     * @dev Update platform fee percentage
     */
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 3000, "Fee too high"); // Max 30%
        platformFeePercentage = newFeePercentage;
    }
    
    /**
     * @dev Update token addresses
     */
    function updateTokenAddresses(address _wrdTokenAddress, address _usdcTokenAddress) external onlyOwner {
        wrdTokenAddress = _wrdTokenAddress;
        usdcTokenAddress = _usdcTokenAddress;
    }
} 