// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/IERC20.sol)

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

interface IFlashloanUser {
  function flashloanCallback(uint amount, address token, bytes memory data) external;
}

contract ManchiFlashLoanProvider is ReentrancyGuard {

  mapping(address => IERC20) public tokens;

  constructor(address[] memory _tokens) {
    for (uint i= 0; i < _tokens.length; i++) {
      tokens[_tokens[i]] = IERC20(_tokens[i]);
    }
  }

  function executeFlashLoan(
  address callback,
  uint amount,
address _token,
bytes memory data
  ) nonReentrant()
  external {
    IERC20 token = tokens[_token];
    uint originalBalance = token.balanceOf(address(this));
    require(address(token) != address(0), 'unsupported token');
    require(originalBalance >= amount, 'amount too high');
    token.transfer(callback, amount);
    IFlashloanUser(callback).flashloanCallback(amount, _token, data);
    require(token.balanceOf(address(this)) == originalBalance, 'flashloan is not reimbursed');
  }
}

contract ExampleFlashloanUser is IFlashloanUser {
  function startFlashloan(
    address flashloan,
    uint amount,
    address token
  )
  external
  {
    ManchiFlashLoanProvider(flashloan).executeFlashLoan(
      address(this),
      amount,
      token,
      bytes('')
    );
  }

  function flashloanCallback(uint amount, address token, bytes memory data) external override {
    //do some arbitrage, liquidation, etc..

    //Reimburse borrowed tokens
    IERC20(token).transfer(msg.sender, amount);
  }
}
