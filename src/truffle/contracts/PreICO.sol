pragma solidity ^0.4.11;

import "./DelegateableOwnerToken.sol";

contract PreICO is DelegateableOwnerToken {
    string public constant name = "BB Token";
    string public constant symbol = "BBTOK";
    uint8 public constant decimals = 18;
  
    uint256 public minPurchase;
    uint _price;
    bool public purchasesEnabled;

    mapping(address => uint) public customerPrice;

    event Purchased(address indexed user, uint256 tokens, uint256 price);

    function PreICO(uint256 initialSupply, uint256 price) {
        totalSupply = initialSupply * (10 ** uint256(decimals));      
        owner = msg.sender;
        balances[owner] = totalSupply;
        _price = price;

        purchasesEnabled = false;
    }

    function() payable {
        buyTokens();
    }

    function claimOwnership() onlyPendingOwner public {
        require(pendingOwner != owner);
        balances[pendingOwner] = balances[owner].add(balances[pendingOwner]);
        balances[owner] = 0;
        super.claimOwnership();
    }

    function setPriceForCustomer(address customerAddress, uint price) onlyOwner returns (bool) {
        if (price < 0) {
            revert();
        }
        customerPrice[customerAddress] = price;
        return true;
    }

    function pricePerETH() constant returns (uint) {
        return _price;
    }

    function ethBalance() constant returns (uint) {
        return this.balance;
    }

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

    function buyTokens() payable returns (bool) {
        require(purchasesEnabled);
        require(msg.value >= minPurchase);

        uint multipler = _price;
        uint refundAmount = 0;

        if (customerPrice[msg.sender] > 0) {
            multipler = customerPrice[msg.sender];
        }

        uint tokens = this.calculateTokens(msg.value, multipler);

        // Work out if a refund is needed.
        if (balances[owner] < tokens) {
            tokens = balances[owner];
            uint ethCost = calculateTokensPrice(tokens, multipler);
            refundAmount = SafeMath.sub(msg.value, ethCost);
        }

        if (balances[owner] >= tokens && tokens > 0 && balances[msg.sender] + tokens > balances[msg.sender]) { 
            balances[msg.sender] += tokens;
            balances[owner] -= tokens;

            if (refundAmount > 0) {
               require(msg.sender.send(refundAmount));
            }

            Purchased(msg.sender, tokens, multipler);
            Transfer(owner, msg.sender, tokens);
            return true;
        } else {
            revert();
        }
    }

    function enablePurchases(bool enabled) onlyOwner returns (bool) {
        purchasesEnabled = enabled;
    }

    function calculateTokens(uint eth, uint tokenPrice) constant returns (uint) {
        uint tens = uint(10) ** (decimals);
        return SafeMath.mul(eth, tens) / tokenPrice;
    }

    function calculateTokensPrice(uint tokensWithDecimals, uint tokenPrice) constant returns (uint) {
        uint tens = uint(10) ** (decimals);
        return SafeMath.div(tokensWithDecimals, tens).mul(tokenPrice);
    }

    function withdrawEth() onlyOwner returns (bool) {
        require(owner.send(this.balance));
        return true;
    }

    function deposit() onlyOwner payable returns (bool) {
        return true;
    }

    function refund(address refundAccount, uint ethAmount, uint tokens) onlyOwner returns (bool) {
        require(refundAccount != address(0));
        require(this.balance >= ethAmount);
        require(balances[refundAccount] >= tokens);
        require(balances[refundAccount] > 0);

        balances[refundAccount] -= tokens;
        balances[owner] += tokens;

        require(refundAccount.send(ethAmount));

        return true;
    }

    function setMinPurchase(uint256 minAmount) onlyOwner returns (bool) {
        minPurchase = minAmount;
        return true;
    }
}