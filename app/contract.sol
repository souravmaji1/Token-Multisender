/**
 *Submitted for verification at amoy.polygonscan.com on 2024-06-18
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract BulkAirdrop {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    event Airdrop(address indexed token, address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function airdrop(address token, address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "Arrays must be the same length");
        IERC20 erc20Token = IERC20(token);
        for (uint256 i = 0; i < recipients.length; i++) {
            require(erc20Token.transferFrom(msg.sender, recipients[i], amounts[i]), "Token transfer failed");
            emit Airdrop(token, recipients[i], amounts[i]);
        }
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        IERC20 erc20Token = IERC20(token);
        require(erc20Token.transfer(owner, amount), "Token transfer failed");
    }
}