// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title Authentica World Chain Payment Verifier
 * @dev Contract deployed on World Chain to receive payment confirmations from Rootstock via Hyperlane
 */
contract WorldChainPaymentVerifier {
    // Rootstock contract address that can send messages
    address public rootstockContract;
    uint16 public rootstockChainId;
    
    // LayerZero endpoint address
    address public lzEndpoint;
    
    // Admin address
    address public admin;
    
    // Payment verification mapping
    mapping(bytes32 => bool) public verifiedPayments;
    
    // Events
    event PaymentVerified(bytes32 indexed paymentId, address indexed userAddress, uint256 amount, uint256 timestamp);
    event ServiceExecuted(bytes32 indexed paymentId, address indexed userAddress);
    
    /**
     * @dev Modifier to restrict access to the Hyperlane relayer
     */
    modifier onlyLzApp() {
        require(msg.sender == lzEndpoint, "Not LayerZero endpoint");
        _;
    }
    
    /**
     * @dev Modifier to restrict access to admin
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }
    
    /**
     * @dev Constructor sets the rootstock contract address and admin
     * @param _lzEndpoint LayerZero endpoint address
     * @param _rootstockContract Rootstock contract address that will send messages
     * @param _rootstockChainId Hyperlane chain ID for Rootstock
     */
    constructor(address _lzEndpoint, address _rootstockContract, uint16 _rootstockChainId) {
        lzEndpoint = _lzEndpoint;
        rootstockContract = _rootstockContract;
        rootstockChainId = _rootstockChainId;
        admin = msg.sender;
    }
    
    /**
     * @dev Receive function to handle LayerZero messages
     * @param _srcChainId Source chain ID
     * @param _srcAddress Source address (Rootstock contract)
     * @param _nonce Message nonce
     * @param _payload Message payload containing payment details
     */
    function lzReceive(uint16 _srcChainId, bytes memory _srcAddress, uint64 _nonce, bytes memory _payload) external onlyLzApp {
        // Verify the source chain and contract
        require(_srcChainId == rootstockChainId, "Invalid source chain");
        
        address srcAddress;
        assembly {
            srcAddress := mload(add(_srcAddress, 20))
        }
        require(srcAddress == rootstockContract, "Invalid source address");
        
        // Decode the payload
        (
            bytes32 paymentId,
            address userAddress,
            uint256 amount,
            uint256 timestamp
        ) = abi.decode(_payload, (bytes32, address, uint256, uint256));
        
        // Verify and store the payment
        verifiedPayments[paymentId] = true;
        
        // Emit payment verified event
        emit PaymentVerified(paymentId, userAddress, amount, timestamp);
        
        // Execute the service
        executeService(paymentId, userAddress);
    }
    
    /**
     * @dev Internal function to execute the verification service
     * @param _paymentId Payment ID to track the service execution
     * @param _userAddress User address to receive the service
     */
    function executeService(bytes32 _paymentId, address _userAddress) internal {
        // In a production environment, this would call an oracle or emit an event
        // that a backend service would listen to and then execute the API calls
        // For our MVP, we simply emit an event that the backend will listen for
        
        emit ServiceExecuted(_paymentId, _userAddress);
    }
    
    /**
     * @dev Admin function to update the Rootstock contract address
     * @param _rootstockContract New Rootstock contract address
     * @param _rootstockChainId New Rootstock chain ID
     */
    function updateRootstockContract(address _rootstockContract, uint16 _rootstockChainId) external onlyAdmin {
        rootstockContract = _rootstockContract;
        rootstockChainId = _rootstockChainId;
    }
    
    /**
     * @dev Admin function to update the LayerZero endpoint
     * @param _lzEndpoint New LayerZero endpoint address
     */
    function updateLzEndpoint(address _lzEndpoint) external onlyAdmin {
        lzEndpoint = _lzEndpoint;
    }
    
    /**
     * @dev Admin function to update admin address
     * @param _admin New admin address
     */
    function updateAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }
} 