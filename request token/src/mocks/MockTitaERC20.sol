// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract MockTitaERC20 is ERC20, ERC20Burnable {

    address[] public tokenHolders; // Array to store token holders' addresses
    constructor() ERC20("Mock TitaERC20", "MTERC") {
        _mint(msg.sender, 150000000 * 10 ** 18);
    }
     function mint(address to, uint256 amount) public {
        _mint(to, amount);
        if (balanceOf(to) > 0) {
            tokenHolders.push(to); // Add the address to the token holders array
        }
    }

    // Function to get the array of all holder addresses
    function getTokenHolders() public view returns (address[] memory) {
        return tokenHolders;
    }
    
  
}