// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title ILayerZeroEndpoint Interface
 * @dev Interface for LayerZero Endpoint which is used by Hyperlane
 */
interface ILayerZeroEndpoint {
    // Send a message to the specified destination chain
    function send(
        uint16 _dstChainId,
        bytes calldata _destination,
        bytes calldata _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes calldata _adapterParams
    ) external payable;

    // Estimate fees for a cross-chain message
    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParam
    ) external view returns (uint256 nativeFee, uint256 zroFee);
} 