var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("PreICO", function(accounts) {
    it("should compile and deploy!!", function(){
        var ownerBalance = 0;
        var owner;
        var ico; 
        return PreICO.deployed().then(function(instance) {
            ico = instance;
            return instance.balanceOf.call(accounts[0]);
        }).then(function(balance) {
            ownerBalance = balance;
            return ico.owner.call();
        }).then(function(owner) {
            assert.equal(ownerBalance.valueOf(), 1000000, "100000 wasn't the owners balance.");
            assert.equal(owner.valueOf(), accounts[0], "The owner wasn't set to the correct person.");
        }); 
    });

    it("should show the correct total supply", function() {
        return PreICO.deployed().then(function(instance) {
            return instance.totalSupply.call();
        }).then(function(_totalSupply) {
            assert.equal(_totalSupply.valueOf(), 1000000, "the total supply was incorret");
        });
    });

    it("should transfer and debit the accounts correctly", function() {
        var ownerBalance, ico;
        var account_from = accounts[0];
        var account_to = accounts[1];
        var result;

        return PreICO.deployed().then(function(instance) {
            ico = instance;
            return ico.transfer(account_to, 100, {from: account_from});
        }).then(function(_result) {
            result = _result;
            return ico.balanceOf.call(account_from);
        }).then(function(_ownerBalance) {
            ownerBalance = _ownerBalance;
            return ico.balanceOf.call(account_to);
        }).then(function(recBalance) {
            assert.equal(ownerBalance.valueOf(), 999900, "the owner balance did not go down.");
            assert.equal(recBalance.valueOf(), 100, "the receiver balance was incorret");
        });
    });

    it("transfer should fail if the sender doesn't have enough funds", function() {
        var ownerBalance, ico;
        var account_from = accounts[0];
        var account_to = accounts[1];
        var to_balance_before, to_balance_after;
        var from_balance_before, from_balance_after;
        var result;

        return PreICO.deployed().then(function(instance) {
            ico = instance;
            return ico.balanceOf.call(account_from);
        }).then(function(_fromBalance) {
            from_balance_before = _fromBalance.valueOf();
            return ico.balanceOf.call(account_to);
        }).then(function(_toBalance) {
            to_balance_before = _toBalance.valueOf();
            return ico.transfer(account_to, 10000000, { from: account_from});
        }).then(function(_result) {
            result = _result;
            return ico.balanceOf.call(account_from);
        }).then(function(_fromBalance) {
            from_balance_after = _fromBalance.valueOf();
            return ico.balanceOf.call(account_to);
        }).then(function(_toBalance) {
            to_balance_after = _toBalance.valueOf();

            var to_diff = to_balance_after - to_balance_before;
            var from_diff = from_balance_after - from_balance_before;
          //  assert.equal(result, false, "the return value should have been false");
            assert.equal(from_diff, 0, "the owner balance should not have changed");
            assert.equal(to_diff, 0, "the reciver balance should not have changed");
        });
    });

    it("transfer should fail if the amount <= 0", function() {
        var ownerBalance, ico;
        var account_from = accounts[0];
        var account_to = accounts[1];
        var to_balance_before, to_balance_after;
        var from_balance_before, from_balance_after;
        var result = undefined;

        return PreICO.deployed().then(function(instance) {
            ico = instance;
            return ico.balanceOf.call(account_from);
        }).then(function(_fromBalance1) {
            from_balance_before = _fromBalance1.valueOf();
            return ico.balanceOf.call(account_to);
        }).then(function(_toBalance) {
            to_balance_before = _toBalance.valueOf();
            return ico.transfer(account_to, -55, { from: account_from});
        }).then(function(_result) {
            result = _result;
            return ico.balanceOf.call(account_from);
        }).then(function(_fromBalance) {
            from_balance_after = _fromBalance.valueOf();
            return ico.balanceOf.call(account_to);
        }).then(function(_toBalance) {
            to_balance_after = _toBalance.valueOf();
            
            var to_diff = to_balance_after - to_balance_before;
            var from_diff = from_balance_after - from_balance_before;

           // assert.equal(result, false, "the return value should have been false");
            assert.equal(from_diff, 0, "the owner balance should not have changed");
            assert.equal(to_diff, 0, "the reciver balance should not have changed");
        });
    });
});