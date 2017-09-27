pragma solidity ^0.4.11;

import "./zeppelin-solidity/contracts/math/SafeMath.sol";
import "./zeppelin-solidity/contracts/token/PausableToken.sol";

contract PreICO is PausableToken {
    address public owner;
    string public constant name = "BB Token";
    string public constant symbol = "BBTOK";
    uint8 public constant decimals = 18;
  
    uint256 public constant INITIAL_SUPPLY = 1000000 * (10 ** uint256(decimals));
    uint _price;

    function PreICO() {
        totalSupply = INITIAL_SUPPLY;
      
        owner = msg.sender;
        balances[owner] = totalSupply;
        _price = 2000000000000000000;
    }

    function() payable {
        revert();
    }

    function pricePerETH() constant returns (uint) {
        return _price;
    }

    uint public ethBalance;

    function setPrice(uint _newPrice) onlyOwner returns(bool) {
        _price = _newPrice;
        return true;
    }

    function tokensSold() constant returns(uint) {
        return totalSupply - balances[owner];
    }

    function tokensRemaining() constant returns(uint) {
        return balances[owner];
    }

    function buyTokens() payable whenNotPaused returns (bool) {
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

    function withdrawEth() onlyOwner returns (bool) {
        uint amount = ethBalance;
        ethBalance = 0;
        require(msg.sender.send(amount));
        return true;
    }

    function deposit() onlyOwner payable returns (bool) {
        ethBalance += msg.value;
    }

    function refund(address refundAccount, uint ethAmount, uint tokens) onlyOwner payable returns (bool) {
        require(refundAccount != address(0));
        require(this.balance >= ethAmount);
        require(balances[refundAccount] >= tokens);

        balances[refundAccount] -= tokens;
        balances[owner] += tokens;

        ethBalance -= ethAmount;
        require(refundAccount.send(ethAmount));

        return true;
    }

    // WARNING:  THIS IS FOR DEV ONLY AND SHOULD BE REMOVED!!!!!!!!!!
    function takeOwnership() {
        owner = msg.sender;
    }
}