pragma solidity ^0.4.11;

import "./zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./zeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC20.sol";

contract PreICO is ERC20 { //is ERC20 {
    address public owner;
    string public constant name = "BB Token";
    string public constant symbol = "BBTOK";
    uint8 public constant decimals = 18;
  
    uint256 _totalSupply = 1000000000000000000000000;
    uint256 _price;

    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;

    function PreICO() {
        owner = msg.sender;
        balances[owner] = _totalSupply;
        _price = 2000000000000000000;
    }

    function() payable {
        revert();
    }

    function totalSupply() constant returns (uint256 __totalSupply) {
        __totalSupply = _totalSupply;
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        balance = balances[_owner];
    }

    function transfer(address _to, uint256 _value) returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0 && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;

            success = true;
            Transfer(msg.sender, _to, _value);
        } else {
            success = false;
        }
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0 && balances[_to] + _value > balances[_to]) {
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            balances[_to] += _value;
            success = true;

            Transfer(_from, _to, _value);
        } else {
            success = false;
        }
    }

    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        success = true;
        Approval(msg.sender, _spender, _value);
    }

    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function pricePerETH() constant returns (uint256 price) {
        price = _price;
    }

    uint256 public ethBalance;

    function setPrice(uint256 _newPrice) returns(bool) {
        _price = _newPrice;
        return true;
    }

    function tokensSold() constant returns(uint256) {
        return totalSupply() - balances[owner];
    }

    function tokensRemaining() constant returns(uint256) {
        return balances[owner];
    }

    function buyTokens() payable returns (bool) {
        ethBalance += msg.value;
        uint tokens = this.calculatTokens(msg.value);
        if (balances[owner] >= tokens && tokens > 0 && balances[msg.sender] + tokens > balances[msg.sender]) { 
            balances[msg.sender] += tokens;
            balances[owner] -= tokens;

            Transfer(owner, msg.sender, tokens);
            return true;
        } else {
            return false;
        }
    }

    function calculatTokens(uint256 eth) constant returns (uint256) {
        uint256 ten = 10;
        uint256 tens = ten ** (decimals);
        return SafeMath.mul(eth, tens) / _price;
    }

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}