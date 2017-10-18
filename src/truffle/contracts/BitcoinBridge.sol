pragma solidity ^0.4.11;

import "./Claimable.sol";
import "./PreICO.sol";

contract BitcoinBridge is Claimable {
    struct PendingPayment {
        address userAddress;
        string bitcoinAddress;
        uint amount;
        bool paid;
        string txId;
    }

    mapping(address => PendingPayment) public pendingPayments;
    mapping(address => uint) public customerPrice;

    uint public pricePerBitcoin;
    uint public minPurchase;
    uint public decimals;
    address icoAddress;
    PreICO ico;

    event PendingPaymentRegistration(address indexed userAddress, string bitcoinAddress, uint amount);

    function BitcoinBridge(address _icoAddress, uint price) {
        pricePerBitcoin = price;
        ico = PreICO(_icoAddress);
        icoAddress = _icoAddress;
        decimals = 18;
    }

    function setDecimals(uint _decimals) onlyOwner returns(bool) {
        decimals = _decimals;
        return true;
    }

    function updateICOAddress(address _icoAddress) onlyOwner {
        require(_icoAddress != address(0));
        ico = PreICO(_icoAddress);
        icoAddress = _icoAddress;
    }

    function() payable {
        revert();
    }

    function registerPendingPayment(string bitcoinAddress, uint amount) returns (bool) {
        require(amount > 0);
        require(amount >= minPurchase);
        require(bytes(bitcoinAddress).length >= 26);
        require(ico.purchasesEnabled());

        PendingPaymentRegistration(msg.sender, bitcoinAddress, amount);
        pendingPayments[msg.sender] = PendingPayment(msg.sender, bitcoinAddress, amount, false, "");
        return true;
    }

    function confirmPayment(address userAddress, string txId) onlyOwner returns (bool) {
        require(pendingPayments[userAddress].userAddress != address(0));
        require(pendingPayments[userAddress].amount > 0);

        pendingPayments[userAddress].paid = true;
        pendingPayments[userAddress].txId = txId;

        // £££££££££££££££   It should now buy tokens.
    }

    event debugMe(address userAddress, uint tokens);

    function buyTokens(address userAddress, uint bitcoinAmount) onlyOwner returns(bool) {
        require(bitcoinAmount > minPurchase);
        require(ico.purchasesEnabled());

        uint multipler = pricePerBitcoin;
        if (customerPrice[userAddress] > 0) {
            multipler = customerPrice[userAddress];
        }

        uint256 tokens = calculateTokens(bitcoinAmount, multipler);

        require(tokens <= ico.balanceOf(msg.sender));
        require(tokens <= ico.balanceOf(msg.sender) + tokens);
        require(tokens > 0);

        debugMe(userAddress, tokens);
        // transfer tokens to user
        bool result = icoAddress.delegatecall(bytes4(sha3("transfer(address,uint256)")), userAddress, tokens);
        require(!result);
        //require(ico.transfer(userAddress, tokens));

        return true;
    }

    function calculateTokens(uint bitcoinAmount, uint tokenPrice) returns(uint) {
        uint tens = uint(10) ** (decimals);
        return SafeMath.mul(bitcoinAmount, tens) / tokenPrice;
    }

    function setPriceForCustomer(address userAddress, uint price) onlyOwner returns(bool) {
        require(userAddress != address(0));
        customerPrice[userAddress] = price;
        return true;
    }

    function setPrice(uint price) onlyOwner returns(bool) {
        pricePerBitcoin = price;
        return true;
    }

    function setMinPurchase(uint amountInBitcoin) onlyOwner returns(bool) {
        minPurchase = amountInBitcoin;
        return true;
    }
}