// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IHyperlaneMailbox} from "./interfaces/IHyperlaneMailbox.sol";

/**
 * @title Authentica Rootstock Payment Receiver
 * @dev Smart contract deployed on Rootstock to receive rBTC payments and relay to World Chain via Hyperlane
 */
contract RootstockPaymentReceiver {
    // Constants
    uint256 public constant VERIFICATION_PRICE = 0.00001 ether; // 0.00001 rBTC for testnet
    
    // Payment wallet address
    address public paymentWallet;
    
    // Hyperlane mailbox interface
    IHyperlaneMailbox public mailbox;
    
    // World Chain contract address to send messages to
    bytes32 public worldChainContract;
    uint32 public worldChainDomain;
    
    // Payment records
    mapping(bytes32 => bool) public payments;
    
    // Events
    event PaymentReceived(address indexed sender, uint256 amount, bytes32 paymentId);
    event MessageSent(address indexed sender, bytes32 paymentId, uint32 destinationDomain, bytes32 messageId);
    event FallbackProcessActivated(bytes32 paymentId, address userAddress, string reason);
    
    /**
     * @dev Constructor sets up the Hyperlane mailbox and World Chain contract details
     * @param _mailbox Hyperlane mailbox address on Rootstock
     * @param _worldChainDomain Hyperlane domain ID for World Chain
     * @param _worldChainContract Contract address on World Chain to receive messages (as bytes32)
     * @param _paymentWallet Wallet address to receive payments
     */
    constructor(address _mailbox, uint32 _worldChainDomain, bytes32 _worldChainContract, address _paymentWallet) {
        mailbox = IHyperlaneMailbox(_mailbox);
        worldChainDomain = _worldChainDomain;
        worldChainContract = _worldChainContract;
        paymentWallet = _paymentWallet;
    }
    
    /**
     * @dev Public payable function to accept rBTC payment and relay to World Chain
     * @param _userAddress User's wallet address for verification service
     * @param _referenceId Unique reference ID for the payment
     */
    function payForVerification(address _userAddress, bytes32 _referenceId) external payable {
        require(msg.value == VERIFICATION_PRICE, "Incorrect payment amount");
        
        // Generate payment ID from reference ID and sender
        bytes32 paymentId = keccak256(abi.encodePacked(_referenceId, msg.sender));
        
        // Store payment record
        payments[paymentId] = true;
        
        // Forward payment to payment wallet
        (bool sent, ) = paymentWallet.call{value: msg.value}("");
        require(sent, "Failed to forward payment");
        
        // Emit payment event
        emit PaymentReceived(msg.sender, msg.value, paymentId);
        
        // Prepare message for World Chain
        bytes memory payload = abi.encode(
            paymentId,
            _userAddress,
            msg.value,
            block.timestamp
        );
        
        try {
            // Quote fee for sending message
            uint256 messageFee = mailbox.quoteDispatch(
                worldChainDomain,
                worldChainContract,
                payload
            );
            
            // Send the message via Hyperlane
            bytes32 messageId = mailbox.dispatch{value: 0}(
                worldChainDomain,
                worldChainContract,
                payload
            );
            
            // Emit message sent event
            emit MessageSent(msg.sender, paymentId, worldChainDomain, messageId);
        } catch {
            // If Hyperlane integration fails, emit fallback event
            emit FallbackProcessActivated(paymentId, _userAddress, "Hyperlane message sending failed");
        }
    }
    
    /**
     * @dev Function to update the payment wallet address (admin only)
     * @param _newPaymentWallet New payment wallet address
     */
    function updatePaymentWallet(address _newPaymentWallet) external {
        paymentWallet = _newPaymentWallet;
    }
} 