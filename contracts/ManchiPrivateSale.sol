// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/IERC20.sol)

pragma solidity 0.8.9;


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

contract ManchiPrivateSale {
  struct Sale {
    address investor;
    uint quantity;
  }

  enum Status {
    INIT,
    ACTIVE,
    ENDED,
    RELEASED
  }
  Status public status;
  address public manchiCoinAddress;
  address public admin;
  uint public end;
  uint public price;
  uint public availableTokens;
  uint public minPurchaseTokens;
  uint public maxPurchaseTokens;
  uint public totalTokensSold;
  mapping(address => bool) public investors;
  mapping(address => Sale) public  sales;
  address[] public investorArray;

  constructor(string memory _name,
    string memory _symbol,
    uint8 _decimals,
    uint _totalSupply) {
    manchiCoinAddress = address(new ManchiCoin(
        _name, _symbol, _decimals, _totalSupply
      ));
    admin = msg.sender;
    status = Status.INIT;
  }

  function start(
    uint duration,
    uint _price,
    uint _availableTokens,
    uint _minPurchaseTokens,
    uint _maxPurchaseTokens
  ) external onlyAdmin() icoInitialized() {
    require(duration > 0, 'duration should be > 0');
    require(_availableTokens > 0, 'availableTokens should be more than 0');
    uint totalSupply = ManchiCoin(manchiCoinAddress).totalSupply();
    require(_availableTokens < totalSupply, 'available tokens should be less than totalSupply');
    require(_minPurchaseTokens > 0, 'min purchase value should be more than zero');
    require(_maxPurchaseTokens > 0 && _maxPurchaseTokens <= _availableTokens, 'max purchase should be more than zero and less than available tokens' );
    end = duration + block.timestamp;
    maxPurchaseTokens = _maxPurchaseTokens;
    minPurchaseTokens = _minPurchaseTokens;
    price = _price;
    availableTokens = _availableTokens;
    status = Status.ACTIVE;
  }

  function whitelist(address investor) external onlyAdmin {
    if (investors[investor] != true) {
      investorArray.push(investor);
      investors[investor] = true;
    }
  }

  function markICOAsEnded() external onlyAdmin {
    if (block.timestamp > end || totalTokensSold >= availableTokens) {
      status = Status.ENDED;
    }
    return;
  }

  function buy() payable external onlyInvestors() {
    require(msg.value % price == 0, 'have to send multiples of price');
    uint quantity = price * msg.value;
    require(quantity >= minPurchaseTokens && quantity <= maxPurchaseTokens, 'have to send between minpurchase and max purchase');
    require(quantity <= availableTokens, 'not enough tokens left to sale');
    if(totalTokensSold >= availableTokens || block.timestamp > end ) {
      status = Status.ENDED;
    }
    require(status == Status.ACTIVE, 'ICO is inactive');
    Sale memory _sale = sales[msg.sender];
    require(_sale.quantity + quantity <= maxPurchaseTokens, 'there is an existing sale that exceeds max limit');
    sales[msg.sender] = Sale(
      msg.sender,
      _sale.quantity + quantity
    );
    totalTokensSold += quantity;
  }

  function release() external onlyAdmin() icoEnded() {
    require(status != Status.RELEASED, 'funds have been released already');
    ManchiCoin coinInstance = ManchiCoin(manchiCoinAddress);
    for (uint i = 0; i < investorArray.length; i++){
      Sale storage sale = sales[investorArray[i]];
      coinInstance.transfer(sale.investor, sale.quantity);
    }
    status = Status.RELEASED;
  }

  function withdraw(address payable to, uint amount) external onlyAdmin() icoEnded() {
    require(status == Status.RELEASED, 'sale tokens not released yet');
    to.transfer(amount);
  }

  function getAllInvestors() public view returns(address[] memory) {
    return investorArray;
  }

  modifier onlyInvestors() {
    require(investors[msg.sender] == true, 'only investors are allowed to participate');
    _;
  }


  modifier onlyAdmin() {
    require(msg.sender == admin, "only admin can invoke this");
    _;
  }

  modifier icoInitialized() {
    require(status == Status.INIT, 'Sale needs to be initialized first');
    _;
  }


  modifier icoEnded() {
    if (block.timestamp > end || availableTokens == 0) {
      status = Status.ENDED;
    }
    require(status == Status.ENDED, 'ICO must be in Ended state');
    _;
  }

}