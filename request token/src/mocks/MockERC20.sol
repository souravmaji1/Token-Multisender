// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockERC20 is ERC20 {
    constructor() ERC20("Mock ERC20", "MERC") {
        _mint(msg.sender, 150000000 * 10 ** 18);
    }
      function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}