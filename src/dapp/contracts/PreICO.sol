pragma solidity ^0.4.4;

//import "./ERC20.sol";

contract PreICO  { //is ERC20 {
    address public owner;

    uint8 public constant decimals = 18;
    uint256 _totalSupply = 1000000;

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    function PreICO() {
        owner = msg.sender;
        balances[owner] = _totalSupply;
    }

    function totalSupply() constant returns (uint totalSupply) {
        totalSupply = _totalSupply;
    }

    function balanceOf(address _owner) constant returns (uint balance) {
        balance = balances[_owner];
    }

    function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0 && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;

            success = true;
        } else {
            success = false;
        }
    }

    function transferFrom(address _from, address _to, uint _value) returns (bool success) {
        revert();
    }

    function approve(address _spender, uint _value) returns (bool success) {
        revert();
    }

    function allowance(address _owner, address _spender) constant returns (uint remaining) {
        revert();
    }
    
  //  event Transfer(address indexed _from, address indexed _to, uint _value);
  //  event Approval(address indexed _owner, address indexed _spender, uint _value);
}