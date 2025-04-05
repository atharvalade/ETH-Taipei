// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title IHyperlaneMailbox
 * @dev Interface for the Hyperlane Mailbox contract, which is the core messaging primitive
 */
interface IHyperlaneMailbox {
    /**
     * @notice Dispatches a message to the destination domain
     * @param _destinationDomain Domain of destination chain
     * @param _recipientAddress Address of recipient on destination chain
     * @param _messageBody Raw bytes content of message
     * @return messageId The ID of the dispatched message
     */
    function dispatch(
        uint32 _destinationDomain,
        bytes32 _recipientAddress,
        bytes calldata _messageBody
    ) external payable returns (bytes32 messageId);
    
    /**
     * @notice Returns the required payment for sending a message to the destination domain
     * @param _destinationDomain Domain of destination chain
     * @param _messageSize Size of the encoded message
     * @return requiredPayment The required payment, in wei
     */
    function quoteDispatch(
        uint32 _destinationDomain,
        bytes32, // recipient
        bytes calldata _messageBody
    ) external view returns (uint256 requiredPayment);
    
    /**
     * @notice Returns the local domain ID for this mailbox
     * @return The local domain ID
     */
    function localDomain() external view returns (uint32);
    
    /**
     * @notice Returns the default ISM for the mailbox
     * @return The address of the default ISM
     */
    function defaultIsm() external view returns (address);
} 