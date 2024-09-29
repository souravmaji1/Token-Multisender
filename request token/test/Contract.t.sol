pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/mocks/MockERC20.sol";
import "../src/mocks/MockCmaxERC20.sol";
import "../src/mocks/MockTitaERC20.sol";
import "../src/Contract.sol";


contract TokenRequestTest is Test {

  TokenRequest tokenRequest;
  MockERC20 usdc; 
  MockCmaxERC20 cmax;
  MockTitaERC20 tita;

  address user = address(0x123);

  function setUp() public {
    usdc = new MockERC20();
    cmax = new MockCmaxERC20();
    tita = new MockTitaERC20();

    tokenRequest = new TokenRequest(
      "Test",
      "TST",
      address(cmax),
      address(usdc),
      1 ether,
      address(tita)
    );
  }

function testDistributeUSDC() public {

  tita.mint(user, 10 * 10**18);

  tita.mint(address(1), 5 * 10**18); 
  tita.mint(address(2), 3 * 10**18);
  tita.mint(address(3), 2 * 10**18);

  // Set up
  address[3] memory holders;
  holders[0] = address(1); 
  // ...

  // Mint 100 USDC 
  usdc.mint(address(this), 100 * 10**18);  

  // Approve 
  usdc.approve(address(tokenRequest), type(uint256).max);

  // Distribute 
  tokenRequest.distributeUSDC();
   
  // Assert transfers
//  uint256 distributed = usdc.balanceOf(address(this));
//  assertEq(distributed, 20 * 10**18); // 80% distributed
//
//  uint256 holder1Balance = usdc.balanceOf(holders[0]);
//  assertGt(holder1Balance, 0); 
  // Don't assert exact transfer amount per holder

}

function testDistributeAnnualUSDC() public {

  vm.warp(block.timestamp + 366 days);


  // Mint 100 USDC
  usdc.mint(address(this), 100 * 10 ** 18);

  // Approve 
  usdc.approve(address(tokenRequest), type(uint256).max);

  // Set last timestamp to 0 to force distribution
 // tokenRequest.lastAnnualDistributionTimestamp = 365 days;

  // Distribute
  tokenRequest.distributeAnnualUSDC();

  // Assert 80% distributed
 // uint distributed = usdc.balanceOf(address(this));
//  assertEq(distributed, 80 * 10 ** 18);

}

function testStakeToken() public {


       vm.deal(user, 10 ether);

       vm.startPrank(user);

        cmax.mint(user, 10 * 10**18); // Transfer 10 USDC to user
        
        uint256 usdcAmount = 10 * 10**18;
        console.log("USDC transfer amount:", usdcAmount);
        
        cmax.approve(address(tokenRequest), type(uint256).max); 
      
        console.log("User USDC balance before:", cmax.balanceOf(user));  
        console.log("Contract USDC balance before:", cmax.balanceOf(address(tokenRequest)));

        console.log("Allowance:", cmax.allowance(user, address(tokenRequest)));  

        tokenRequest.stakeCMAX(1);

        console.log("User USDC balance after:", cmax.balanceOf(user));
        console.log("Contract USDC balance after:", cmax.balanceOf(address(tokenRequest)));
        
        vm.stopPrank();



 
}





function testBurnToken() public {


       vm.deal(user, 10 ether);

       vm.startPrank(user);

        tita.mint(user, 10 * 10**18); // Transfer 10 USDC to user
        
        uint256 usdcAmount = 10 * 10**18;
        console.log("USDC transfer amount:", usdcAmount);
        
        tita.approve(address(tokenRequest), type(uint256).max); 
      
        console.log("User USDC balance before:", tita.balanceOf(user));  
        console.log("Contract USDC balance before:", tita.balanceOf(address(tokenRequest)));

        console.log("Allowance:", usdc.allowance(user, address(tokenRequest)));  

        tokenRequest.burnToken(1);

        console.log("User USDC balance after:", tita.balanceOf(user));
        console.log("Contract USDC balance after:", tita.balanceOf(address(tokenRequest)));
        
        vm.stopPrank();



 
}




   function testTitaToken() public {
        vm.deal(user, 10 ether);

       vm.startPrank(user);

        usdc.mint(user, 10 * 10**18); // Transfer 10 USDC to user
        
        uint256 usdcAmount = 10 * 10**18;
        console.log("USDC transfer amount:", usdcAmount);
        
        usdc.approve(address(tokenRequest), type(uint256).max); 
      
        console.log("User USDC balance before:", usdc.balanceOf(user));  
        console.log("Contract USDC balance before:", usdc.balanceOf(address(tokenRequest)));

        console.log("Allowance:", usdc.allowance(user, address(tokenRequest)));  

        tokenRequest.requestToken(user, 1);

        console.log("User USDC balance after:", usdc.balanceOf(user));
        console.log("Contract USDC balance after:", usdc.balanceOf(address(tokenRequest)));
        
        vm.stopPrank();
    }

  function testCmaxToken() public {

    vm.deal(user, 1 ether);
    vm.prank(user);

    uint256 amount = 1000 * 10**18;
    
    cmax.mint(user, amount);
    usdc.mint(user, 10 * 10**18);

    usdc.approve(address(tokenRequest), type(uint256).max);

    tokenRequest.requestCmaxToken(
      user, 
      1
    ); 

  }

}