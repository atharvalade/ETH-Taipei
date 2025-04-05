// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ILayerZeroEndpoint} from "./interfaces/ILayerZeroEndpoint.sol";
import {BytesLib} from "./libraries/BytesLib.sol";

/**
 * @title Authentica Rootstock Payment Receiver
 * @dev Smart contract deployed on Rootstock to receive rBTC payments and relay to World Chain via Hyperlane
 */
contract RootstockPaymentReceiver {
    using BytesLib for bytes;
    
    // Constants
    uint256 public constant VERIFICATION_PRICE = 0.001 ether; // 0.001 rBTC for testnet
    
    // Hyperlane endpoint interface
    ILayerZeroEndpoint public endpoint;
    
    // World Chain contract address to send messages to
    address public worldChainContract;
    uint16 public worldChainId;
    
    // Payment records
    mapping(bytes32 => bool) public payments;
    
    // Events
    event PaymentReceived(address indexed sender, uint256 amount, bytes32 paymentId);
    event MessageSent(address indexed sender, bytes32 paymentId, uint16 destinationChainId);
    
    /**
     * @dev Constructor sets up the Hyperlane endpoint and World Chain contract details
     * @param _endpoint Hyperlane endpoint address on Rootstock
     * @param _worldChainId Hyperlane chain ID for World Chain
     * @param _worldChainContract Contract address on World Chain to receive messages
     */
    constructor(address _endpoint, uint16 _worldChainId, address _worldChainContract) {
        endpoint = ILayerZeroEndpoint(_endpoint);
        worldChainId = _worldChainId;
        worldChainContract = _worldChainContract;
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
        
        // Emit payment event
        emit PaymentReceived(msg.sender, msg.value, paymentId);
        
        // Prepare message for World Chain
        bytes memory payload = abi.encode(
            paymentId,
            _userAddress,
            msg.value,
            block.timestamp
        );
        
        // Send cross-chain message via Hyperlane
        bytes memory adapterParams = bytes("");
        
        // Quote fee for sending message
        (uint256 messageFee,) = endpoint.estimateFees(
            worldChainId,
            worldChainContract,
            payload,
            false,
            adapterParams
        );
        
        // Send the message
        endpoint.send{value: messageFee}(
            worldChainId,
            abi.encodePacked(worldChainContract),
            payload,
            payable(msg.sender),
            address(0x0),
            adapterParams
        );
        
        // Emit message sent event
        emit MessageSent(msg.sender, paymentId, worldChainId);
    }
    
    /**
     * @dev Admin function to withdraw funds
     */
    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
} 