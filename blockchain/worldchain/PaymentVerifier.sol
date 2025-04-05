// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IHyperlaneReceiver} from "./interfaces/IHyperlaneReceiver.sol";

/**
 * @title Authentica World Chain Payment Verifier
 * @dev Contract deployed on World Chain to receive payment confirmations from Rootstock via Hyperlane
 */
contract WorldChainPaymentVerifier is IHyperlaneReceiver {
    // Rootstock contract address that can send messages
    bytes32 public rootstockContract;
    uint32 public rootstockDomain;
    
    // Hyperlane mailbox address
    address public mailbox;
    
    // Admin address
    address public admin;
    
    // Payment verification mapping
    mapping(bytes32 => bool) public verifiedPayments;
    
    // Events
    event PaymentVerified(bytes32 indexed paymentId, address indexed userAddress, uint256 amount, uint256 timestamp);
    event ServiceExecuted(bytes32 indexed paymentId, address indexed userAddress);
    
    /**
     * @dev Modifier to restrict access to the Hyperlane mailbox
     */
    modifier onlyMailbox() {
        require(msg.sender == mailbox, "Not Hyperlane mailbox");
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
     * @param _mailbox Hyperlane mailbox address
     * @param _rootstockContract Rootstock contract address that will send messages (as bytes32)
     * @param _rootstockDomain Hyperlane domain ID for Rootstock
     */
    constructor(address _mailbox, bytes32 _rootstockContract, uint32 _rootstockDomain) {
        mailbox = _mailbox;
        rootstockContract = _rootstockContract;
        rootstockDomain = _rootstockDomain;
        admin = msg.sender;
    }
    
    /**
     * @dev Implementation of the IHyperlaneReceiver interface to handle incoming messages
     * @param _origin Source domain (Rootstock)
     * @param _sender Source address (Rootstock contract)
     * @param _body Message payload containing payment details
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external override onlyMailbox {
        // Verify the source chain and contract
        require(_origin == rootstockDomain, "Invalid source domain");
        require(_sender == rootstockContract, "Invalid source address");
        
        // Decode the payload
        (
            bytes32 paymentId,
            address userAddress,
            uint256 amount,
            uint256 timestamp
        ) = abi.decode(_body, (bytes32, address, uint256, uint256));
        
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
     * @param _rootstockContract New Rootstock contract address (as bytes32)
     * @param _rootstockDomain New Rootstock domain ID
     */
    function updateRootstockContract(bytes32 _rootstockContract, uint32 _rootstockDomain) external onlyAdmin {
        rootstockContract = _rootstockContract;
        rootstockDomain = _rootstockDomain;
    }
    
    /**
     * @dev Admin function to update the Hyperlane mailbox
     * @param _mailbox New Hyperlane mailbox address
     */
    function updateMailbox(address _mailbox) external onlyAdmin {
        mailbox = _mailbox;
    }
    
    /**
     * @dev Admin function to update admin address
     * @param _admin New admin address
     */
    function updateAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }
} 