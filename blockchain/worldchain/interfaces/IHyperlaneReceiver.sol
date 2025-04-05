// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title IHyperlaneReceiver
 * @dev Interface for contracts that can receive messages from Hyperlane
 */
interface IHyperlaneReceiver {
    /**
     * @notice Receives a message from the Hyperlane Mailbox and processes it
     * @param _origin The domain ID of the chain where the message originated
     * @param _sender The address of the message sender on the origin chain
     * @param _body The contents of the message
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external;
} 