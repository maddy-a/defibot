// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/IERC20.sol)

pragma solidity 0.8.9;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {

  function totalSupply() external view returns (uint256);


  function balanceOf(address account) external view returns (uint256);


  function transfer(address recipient, uint256 amount) external returns (bool);


  function allowance(address owner, address spender) external view returns (uint256);


  function approve(address spender, uint256 amount) external returns (bool);


  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) external returns (bool);


  event Transfer(address indexed from, address indexed to, uint256 value);


  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ManchiCoin is IERC20 {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint public totalSupply;
  mapping(address => uint) public balances;
  mapping(address => mapping(address => uint)) allowed;

  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint _totalSupply) {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    totalSupply = _totalSupply;
    balances[msg.sender] = _totalSupply;
  }

  function transfer(address to, uint value) public returns(bool) {
    require(balances[msg.sender] >=value, 'not enough funds');
    balances[msg.sender] -= value;
    balances[to] += value;
    emit Transfer(msg.sender, to, value);
    return true;
  }

  function transferFrom(address from, address to, uint amount) public returns (bool) {
    require(balances[msg.sender] >=amount, 'not enough funds');
    balances[msg.sender] -= amount;
    balances[to] += amount;
    allowed[from][msg.sender] -= amount;
    emit Transfer(msg.sender, to, amount);
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    require(spender != msg.sender, 'doesnt make sense');
    allowed[spender][msg.sender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function allowance(address owner, address spender) external view returns (uint256) {
    return allowed[spender][owner];
  }

  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }
}