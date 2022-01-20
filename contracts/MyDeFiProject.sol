// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './CTokenInterface.sol';
import './ComptrollerInterface.sol';
import './PriceOracleInterface.sol';

contract MyDeFiProject {

  ComptrollerInterface public comptroller;
  PriceOracleInterface public priceOracle;

  constructor(
  address _comptroller,
address _priceOracle
  )  {
    comptroller = ComptrollerInterface(_comptroller);
    priceOracle = PriceOracleInterface(_priceOracle);
  }

  function supply(address cTokenAddress, uint underlyingAmount) {
    CTokenInterface cToken = CTokenInterface(cTokenAddress);
    address underlyingAddress = cToken.underlying();
    IERC20(underlyingAddress).approve(cTokenAddress, underlyingAmount);
    uint result = cToken.mint(underlyingAmount);
    require(
      result == 0,
      'cToken#mint() failed. see Compound ErrorReporter.sol for details'
    );
  }
}
