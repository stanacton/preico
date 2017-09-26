pragma solidity ^0.4.11;

import "./zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./zeppelin-solidity/contracts/math/SafeMath.sol";
import "./zeppelin-solidity/contracts/token/StandardToken.sol";
import "./zeppelin-solidity/contracts/token/PausableToken.sol";

contract PreICOZepplin is StandardToken {
    address public owner;
    string public constant name = "BB Token";
    string public constant symbol = "BBTOK";
    uint8 public constant decimals = 18;
  
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals));
    uint _price;

    function PreICOZepplin() {
        totalSupply = INITIAL_SUPPLY;
      
        owner = msg.sender;
        balances[owner] = totalSupply;
        _price = 2000000000000000000;
    }

    function() payable {
        revert();
    }

    function balanceOf(address _owner) constant returns (uint) {
        return balances[_owner];
    }

    function transfer(address _to, uint _value) returns (bool success) {
        if (balances[msg.sender] >= _value && _value > 0 && balances[_to] + _value > balances[_to]) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;

            success = true;
            Transfer(msg.sender, _to, _value);
        } else {
            success = false;
        }
    }

    function transferFrom(address _from, address _to, uint _value) returns (bool) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0 && balances[_to] + _value > balances[_to]) {
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(_from, _to, _value);
            return true;
        } else {
            revert();
            return false;
        }
    }

    function allowance(address _owner, address _spender) constant returns (uint remaining) {
        return allowed[_owner][_spender];
    }

    function pricePerETH() constant returns (uint) {
        return _price;
    }

    uint public ethBalance;

    function setPrice(uint _newPrice) returns(bool) {
        _price = _newPrice;
        return true;
    }

    function tokensSold() constant returns(uint) {
        return totalSupply - balances[owner];
    }

    function tokensRemaining() constant returns(uint) {
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

    function calculatTokens(uint eth) constant returns (uint) {
        uint ten = 10;
        uint tens = ten ** (decimals);
        return SafeMath.mul(eth, tens) / _price;
    }

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}