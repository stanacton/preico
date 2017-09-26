/*
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
            assert.equal(fromWei(ownerBalance), 1000000, "100000 wasn't the owners balance.");
            assert.equal(owner.valueOf(), accounts[0], "The owner wasn't set to the correct person.");
        }); 
    });

    describe("totalSupply", function() {
        it("should show the correct total supply", function() {
            return PreICO.deployed().then(function(instance) {
                return instance.totalSupply.call();
            }).then(function(_totalSupply) {
                assert.equal(fromWei(_totalSupply).valueOf(), 1000000, "the total supply was incorret");
            });
        });
    });

    describe("transfer", function() {

        it("should transfer and debit the accounts correctly", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var result;
            var watcher, events;
            var transferAmount = toWei(100);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.Transfer();
            }).then(function(_watcher) {
                watcher = _watcher;
                return ico.transfer(account_to, transferAmount, {from: account_from});
            }).then(function(_result) {
                result = _result;
                return ico.balanceOf.call(account_from);
            }).then(function(_ownerBalance) {
                ownerBalance = fromWei(_ownerBalance);
                return watcher.get();
            }).then(function(_events) {
                events = _events;
                return ico.balanceOf.call(account_to);
            }).then(function(recBalance) {
                assert.equal(ownerBalance.valueOf(), 999900, "the owner balance did not go down.");
                assert.equal(recBalance.valueOf(), transferAmount, "the receiver balance was incorret");
    
                assert.equal(events.length, 1, "events didn't contain an transfer event");
                assert.equal(events[0].args._from.valueOf(), account_from, "the from account was incorrect");
                assert.equal(events[0].args._to.valueOf(), account_to, "the to account was incorrect");
                assert.equal((events[0].args._value).valueOf(), transferAmount, "the value was incorrect");
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
                from_balance_before = (_fromBalance).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = (_toBalance).valueOf();
                return ico.transfer(account_to, toWei(10000000), { from: account_from});
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
 
    describe("transferFrom", function() {
        it("should trasfer to the correct account from the correct account in the correct amount.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(5);
            var allowanceLeft;
            var watcher, events;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = (_fromBalance1.valueOf());
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function(_result) {
                result = _result;
                return ico.allowance.call(account_from, actor);
            }).then(function(_allowance) {
                allowanceLeft = _allowance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_after = (_fromBalance.valueOf());
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = _toBalance.valueOf();
                return watcher.get();
            }).then(function(events) {
                var to_diff = fromWei(to_balance_after) - fromWei(to_balance_before);
                var from_diff = fromWei(from_balance_after) - fromWei(from_balance_before);

               // assert.equal(result, false, "the return value should have been false");
                assert.equal(from_diff, 0-fromWei(amountToTransfer), "the from account should be less");
                assert.equal(to_diff, fromWei(amountToTransfer), "the to account should have a postive value");
                assert.equal(allowanceLeft, 0, "the allowance of the actor should now be zero");
    
                assert.equal(events.length, 1, "events didn't contain an transfer event");
                assert.equal(events[0].args._from.valueOf(), account_from, "events didn't contain an transfer event");
                assert.equal(events[0].args._to.valueOf(), account_to, "events didn't contain a transfer event");
                assert.equal(events[0].args._value.valueOf(), amountToTransfer, "events didn't contain an transfer event");
            });
        });
    
        it("should fail if the amount is less than zero.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = -44;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, 5, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
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
                assert.equal(from_diff, 0, "the from account shouldn't have changed");
                assert.equal(to_diff, 0, "the to account shouldn't have changed");
            });
        });
    
        it("should fail if the from balance is too low.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(1000000);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
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
                assert.equal(from_diff, 0, "the from account balance should not have changed");
                assert.equal(to_diff, 0, "the to account balance should not have changed");
            });
        });
    
        it("should fail if the spender has exceeded their limit", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(10);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function() {
                // second invalid spend
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function(_result) {
                result = _result;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_after = _fromBalance.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = _toBalance.valueOf();
                
                var to_diff = fromWei(to_balance_after) - fromWei(to_balance_before);
                var from_diff = fromWei(from_balance_after) - fromWei(from_balance_before);
    
                assert.equal(from_diff, 0 - fromWei(amountToTransfer), "the from account balance should have changed by the amout to transfer only");
                assert.equal(to_diff, fromWei(amountToTransfer), "the to account balance should have changed by the amout to transfer only");
            });
        });
    
        it("should fail if the sender is not authorized", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[4]; // IMPORTANT: this must be different to all other tests as the contract is a singleton
            var amountToTransfer = 1;
            var watcher, events;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
    
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function(_result) {
                result = _result;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_after = _fromBalance.valueOf();
                return watcher.get();
            }).then(function(_events) {
                events = _events;
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = _toBalance.valueOf();
                
                var to_diff = to_balance_after - to_balance_before;
                var from_diff = from_balance_after - from_balance_before;
    
               // assert.equal(result, false, "the return value should have been false");
                assert.equal(from_diff, 0, "the from account balance should not have changed");
                assert.equal(to_diff, 0, "the to account balance should not have changed");
                assert.equal(events.length, 0, "No event should have been raised");
            });
        });   
    });

    describe("approve & allowance", function() {
        it("should show the correct allowance when requested", function() {
            var ownerBalance, ico;
            var spender = accounts[5];
            var owner = accounts[0];
            var spendAmount = 10;
            var allowanceBeforeAllocation;
            var allowanceAfterAllocation;
            var approval_watcher, events;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                approval_watcher = ico.Approval();
    
                return ico.allowance.call(owner, spender);
            }).then(function(_allowance) {
                allowanceBeforeAllocation = _allowance;
                return ico.approve(spender, spendAmount);
            }).then(function() {
                return ico.allowance.call(owner, spender);
            }).then(function(_allowance) {
                allowanceAfterAllocation = _allowance;
                return approval_watcher.get();
            }).then(function(events) {
                assert.equal(allowanceBeforeAllocation, 0, "The initial allowance amount should be zero");
                assert.equal(allowanceAfterAllocation, spendAmount, "The allocation amount is incorrect.");
    
                assert.equal(events.length, 1, "events didn't contain an Approval event");
                assert.equal(events[0].args._owner.valueOf(), owner, "the owner was incorrect");
                assert.equal(events[0].args._spender.valueOf(), spender, "the spender was incorrect");
                assert.equal(events[0].args._value.valueOf(), spendAmount, "the value was incorrect");
            });
        });
    });

    describe("transferFrom", function() {
        it("should trasfer to the correct account from the correct account in the correct amount.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(5);
            var allowanceLeft;
            var watcher, events;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = fromWei(_fromBalance1).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = fromWei(_toBalance).valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function(_result) {
                result = _result;
                return ico.allowance.call(account_from, actor);
            }).then(function(_allowance) {
                allowanceLeft = _allowance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_after = fromWei(_fromBalance).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = fromWei(_toBalance).valueOf();
                return watcher.get();
            }).then(function(events) {
                var to_diff = (to_balance_after) - (to_balance_before);
                var from_diff = (from_balance_after) - (from_balance_before);
    
               // assert.equal(result, false, "the return value should have been false");
                assert.equal((from_diff), 0-fromWei(amountToTransfer), "the from account should be less");
                assert.equal(toWei(to_diff), amountToTransfer, "the to account should have a postive value");
                assert.equal(allowanceLeft, 0, "the allowance of the actor should now be zero");
    
                assert.equal(events.length, 1, "events didn't contain an transfer event");
                assert.equal(events[0].args._from.valueOf(), account_from, "events didn't contain an transfer event");
                assert.equal(events[0].args._to.valueOf(), account_to, "events didn't contain a transfer event");
                assert.equal(events[0].args._value.valueOf(), amountToTransfer, "events didn't contain an transfer event");
            });
        });
    
       it("should fail if the amount is less than zero.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = -44;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, 5, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
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
                assert.equal(from_diff, 0, "the from account shouldn't have changed");
                assert.equal(to_diff, 0, "the to account shouldn't have changed");
            });
        });
    
        it("should fail if the from balance is too low.", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(1000000);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
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
                assert.equal(from_diff, 0, "the from account balance should not have changed");
                assert.equal(to_diff, 0, "the to account balance should not have changed");
            });
        });
   
        it("should fail if the spender has exceeded their limit", function() {
            var ownerBalance, ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var actor = accounts[3];
            var amountToTransfer = toWei(10);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = fromWei(_fromBalance1).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = fromWei(_toBalance).valueOf();
                return ico.approve(actor, amountToTransfer, { from: account_from });
            }).then(function() {
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function() {
                // second invalid spend
                return ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
            }).then(function(_result) {
                result = _result;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_after = fromWei(_fromBalance).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = fromWei(_toBalance).valueOf();
                
                var to_diff = to_balance_after - to_balance_before;
                var from_diff = from_balance_after - from_balance_before;
    
                assert.equal(from_diff, 0 - fromWei(amountToTransfer), "1) the from account balance should have changed by the amout to transfer only");
                assert.equal(toWei(to_diff), amountToTransfer, "2) the to account balance should have changed by the amout to transfer only");
            });
        });
   
     
    });

    describe("buyTokens", function() {
        it("should calculate and allocate the correct tokens", function() {
            var ownerBalance, ico;
            var customerAccount = accounts[6];
            var owner = accounts[0];
            
            var initialOwnerBalance, finalOwnerBalance;
            var initialCusBalance, finalCusBalance;
            var watcher;
            var eth = 2;
            var payment = toWei(eth);
            var price = toWei(0.5);
            var ethBalance = 0;
            var expectedNet = 4;

            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                
                return ico.setPrice(price);
            }).then(function(_balance) {
                
                return ico.balanceOf.call(owner);
            }).then(function(_balance) {
                initialOwnerBalance = _balance;
                return ico.balanceOf.call(customerAccount);
            }).then(function(_balance) {
                initialCusBalance = _balance;
                return ico.buyTokens({ value: payment,  from: customerAccount });
            }).then(function() {
                return ico.ethBalance.call();
            }).then(function(_ethBalance) {
                ethBalance = _ethBalance;
                return ico.balanceOf.call(owner);
            }).then(function(_balance) {
                finalOwnerBalance = _balance;
                return ico.balanceOf.call(customerAccount);
            }).then(function(_balance) {
                finalCusBalance = _balance;
                var cusDiff = finalCusBalance.minus(initialCusBalance).valueOf();
                var ownerDiff = finalOwnerBalance.minus(initialOwnerBalance).valueOf();
    
                assert.equal(fromWei(cusDiff), expectedNet, "the customers account should have been credited");
                assert.equal(fromWei(ownerDiff), 0-expectedNet, "the owner account should be less");
                assert.equal(fromWei(ethBalance), eth, "ether balance is incorrect");
            });
        });
        
        it("should calculate and allocate the correct tokens with different amounts", function() {
            var ownerBalance, ico;
            var customerAccount = accounts[6];
            var owner = accounts[0];
            
            var initialOwnerBalance, finalOwnerBalance;
            var initialCusBalance, finalCusBalance;
            var watcher;
            var eth = 2;
            var payment = toWei(eth);
            var price = toWei(4);
            var ethBalance = 0;
            var expectedNet = 0.5;
            var ethBalanceBefore, ethBalanceAfter;

            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                
                return ico.setPrice(price);
            }).then(function() {
                return ico.ethBalance.call();
            }).then(function(_ethBalance) {
                ethBalanceBefore = _ethBalance;
                
                return ico.balanceOf.call(owner);
            }).then(function(_balance) {
                initialOwnerBalance = _balance;
                return ico.balanceOf.call(customerAccount);
            }).then(function(_balance) {
                initialCusBalance = _balance;
                return ico.buyTokens({ value: payment,  from: customerAccount });
            }).then(function() {
                return ico.ethBalance.call();
            }).then(function(_ethBalance) {
                ethBalanceAfter = _ethBalance;
                return ico.balanceOf.call(owner);
            }).then(function(_balance) {
                finalOwnerBalance = _balance;
                return ico.balanceOf.call(customerAccount);
            }).then(function(_balance) {
                finalCusBalance = _balance;
                var cusDiff = finalCusBalance.minus(initialCusBalance).valueOf();
                var ownerDiff = finalOwnerBalance.minus(initialOwnerBalance).valueOf();
                var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();

                assert.equal(fromWei(cusDiff), expectedNet, "the customers account should have been credited");
                assert.equal(fromWei(ownerDiff), 0-expectedNet, "the owner account should be less");
                assert.equal(fromWei(ethDiff), eth, "ether balance is incorrect");
            });
        }); 
    });

    var pricingTestData = [];
    
    pricingTestData.push({ "price": 5, "eth": 5, "expected": 1});
    pricingTestData.push({ "price": 5, "eth": 10, "expected": 2});
    pricingTestData.push({ "price": 5, "eth": 2.5, "expected": 0.5});
    pricingTestData.push({ "price": 5, "eth": 1, "expected": 0.2});
    pricingTestData.push({ "price": 1, "eth": 5, "expected": 5});
    pricingTestData.push({ "price": 0.5, "eth": 0.5, "expected": 1});
    pricingTestData.push({ "price": 0.5, "eth": 5, "expected": 10});
    pricingTestData.push({ "price": 0.5, "eth": 1, "expected": 2});
    pricingTestData.push({ "price": 0.6, "eth": 1, "expected": 1.666666666666666666});
    
    describe("calculateTokens", function() {
        for(var i=0;i < pricingTestData.length;i++) {
            var data = pricingTestData[i];
            (function(td) {
                it("should calculate the correct price for price: " + td.price + " for eth: " + td.eth, function(done) {
                    var ico;
                    var price = toWei(td.price);
                    var eth = toWei(td.eth);
        
                    PreICO.deployed().then(function(instance) {
                        ico = instance;
                        
                        return ico.setPrice(price);
                    }).then(function() {
                        
                        return ico.calculatTokens.call(eth);
                    }).then(function(tokens) {
                        assert.equal(fromWei(tokens.valueOf()), (td.expected));
                        done();
                    });        
                });
            })(data);
        }
    });

    describe("buyTokens", function() {
        for(var i=0;i < pricingTestData.length;i++) {
            var data = pricingTestData[i];
            (function(td, user) {
                it("should buy the correct amount of tokens with " + td.price + " for eth: " + td.eth, function(done) {
                    var ico;
                
                    var customerAccount = accounts[3];
                    var owner = accounts[0];
                    
                    var ownerInitialBalance, ownerFinalBalance
                    var customerInitialBalance, customerFinalBalance;
                    
                    var payment = toWei(td.eth);
                    var price = toWei(td.price);
                    var expected = td.expected;
                    var ethBalanceBefore, ethBalanceAfter;
        
                    PreICO.deployed().then(function(instance) {
                        ico = instance;

                        return ico.setPrice(price);
                    }).then(function() {
                        return ico.ethBalance.call();
                    }).then(function(_ethBalance) {
                        ethBalanceBefore = _ethBalance;
                        return ico.balanceOf.call(owner);
                    }).then(function(_balance) {
                        ownerInitialBalance = _balance;
                        return ico.balanceOf.call(customerAccount);
                    }).then(function(_balance) {
                        customerInitialBalance = _balance;
                        return ico.buyTokens({ value: payment,  from: customerAccount });
                    }).then(function() {
                        return ico.ethBalance.call();
                    }).then(function(_ethBalance) {
                        ethBalanceAfter = _ethBalance;
                        return ico.balanceOf.call(owner);
                    }).then(function(_balance) {
                        ownerFinalBalance = _balance;
                        return ico.balanceOf.call(customerAccount);
                    }).then(function(_balance) {
                        customerFinalBalance = _balance;
                        var cusDiff = customerFinalBalance.minus(customerInitialBalance).valueOf();
                        var ownerDiff = ownerFinalBalance.minus(ownerInitialBalance).valueOf();
                        var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();
                        
                        assert.equal(fromWei(cusDiff), td.expected, "the customers account should have been credited");
                        assert.equal(fromWei(ownerDiff), 0-td.expected, "the owner account should be less");
                        assert.equal(ethDiff, toWei(td.eth), "ether balance is incorrect");
                        done();
                    });
                });
            })(data, i + 1);
        }
    });
});

function toWei(value) {
    return web3.toWei(value, "ether");
}

function fromWei(value) {
    return web3.fromWei(value, "ether");
}

*/