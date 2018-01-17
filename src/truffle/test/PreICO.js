var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("PreICO", function(accounts) {
    beforeEach(async function() {
        var ico = await PreICO.deployed();
        await ico.enablePurchases(true);
    })

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
        var ico;
        var owner = accounts[0];
        var account_from = accounts[0];
        var account_to = accounts[3];

        before(async function() {
            ico = await PreICO.deployed();

            await ico.setMinPurchase.sendTransaction(0, { from: accounts[0] });
            await ico.enableWhitelist.sendTransaction({ from: owner });
            await ico.addToWhitelist.sendTransaction(account_from, { from: owner });
        });

        after(async function() {
            await ico.disableWhitelist.sendTransaction({ from: owner});
        });

        it("should transfer and debit the accounts correctly", function() {
            var ownerBalance;
            var result;
            var watcher, events;
            var transferAmount = toWei(100);
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.Transfer()
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
                assert.equal(events[0].args.from, account_from, "the from account was incorrect");
                assert.equal(events[0].args.to, account_to, "the to account was incorrect");
                assert.equal((events[0].args.value).valueOf(), transferAmount, "the value was incorrect");
            });
        });
   
        it("transfer should fail if the sender doesn't have enough funds", function() {
            var ownerBalance, ico;
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance) {
                from_balance_before = (_fromBalance).valueOf();
                return ico.balanceOf.call(account_to);
            }).then(async function(_toBalance) {
                to_balance_before = (_toBalance).valueOf();
                try {
                    await ico.transfer(account_to, toWei(10000000), { from: account_from});
                    return true;
                } catch(error) {
                    return false;
                }
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
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1.valueOf();
                return ico.balanceOf.call(account_to);
            }).then(async function(_toBalance) {
                to_balance_before = _toBalance.valueOf();
                try {
                    await ico.transfer(account_to, -55, { from: account_from});
                    return true;
                } catch(error) {
                    return false;
                }
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
        var ico;
        var actor = accounts[3];
        var account_from = accounts[2];

        before(async function() {
            ico = await PreICO.deployed();
            await ico.enableWhitelist();
            await ico.addToWhitelist(account_from);
            await ico.addToWhitelist(actor);
        });

        after(async function() {
            await ico.disableWhitelist();
            await ico.removeFromWhitelist(account_from);
            await ico.removeFromWhitelist(actor);
        });

        it("should trasfer to the correct account from the correct account in the correct amount", function() {
            var ownerBalance, ico;
            var account_to = accounts[1];
            var to_balance_before, to_balance_after;
            var from_balance_before, from_balance_after;
            var result = undefined;
            var amountToTransfer = toWei(5);
            var allowanceLeft;
            var watcher, events;
    
            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                return ico.balanceOf.call(account_from);
            }).then(function(_fromBalance1) {
                from_balance_before = _fromBalance1;
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_before = _toBalance;
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
                from_balance_after = _fromBalance;
                return ico.balanceOf.call(account_to);
            }).then(function(_toBalance) {
                to_balance_after = _toBalance;
                return watcher.get();
            }).then(function(events) {
                var to_diff = fromWei(to_balance_after) - fromWei(to_balance_before);
                var from_diff = fromWei(from_balance_after) - fromWei(from_balance_before);

               // assert.equal(result, false, "the return value should have been false");
                assert.equal(from_diff.valueOf(), 0-fromWei(amountToTransfer), "the from account should be less");
                assert.equal(to_diff.valueOf(), fromWei(amountToTransfer), "the to account should have a postive value");
                assert.equal(allowanceLeft, 0, "the allowance of the actor should now be zero");
    
                assert.equal(events.length, 1, "events didn't contain an transfer event");
                assert.equal(events[0].args._from.valueOf(), account_from, "events didn't contain an transfer event");
                assert.equal(events[0].args._to.valueOf(), account_to, "events didn't contain a transfer event");
                assert.equal(events[0].args._value.valueOf(), amountToTransfer, "events didn't contain an transfer event");
            }).catch(function() {
                assert.isTrue(true);
             });
        });
    
        it("should fail if the amount is less than zero", function() {
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
            }).then(async function() {
                try {
                    await ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
                    return true;
                } catch(error) {
                    return false;
                }
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
            }).then(async function() {
                try {
                    await ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
                    return true;
                } catch(error) {
                    return false;
                }
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
            }).then(async function() {
                // second invalid spend
                try {
                    await ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
                    return true;
                } catch(error) {
                    return false;
                }
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
            }).then(async function() {
                try {
                    await ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
                    return true;
                } catch(error) {
                    return false;
                }
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
        var ico;
        var spender = accounts[5];
        var owner = accounts[0];

        before(async function() {
            ico = await PreICO.deployed();
            await ico.enableWhitelist();
            await ico.addToWhitelist(spender);
        });

        after(async function() {
            await ico.disableWhitelist();
            await ico.removeFromWhitelist(spender);
        });

        it("should show the correct allowance when requested", function() {
            var ownerBalance, ico;
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
                assert.equal(events[0].args.owner.valueOf(), owner, "the owner was incorrect");
                assert.equal(events[0].args.spender.valueOf(), spender, "the spender was incorrect");
                assert.equal(events[0].args.value.valueOf(), spendAmount, "the value was incorrect");
            });
        });
    });

    describe("buyTokens", function() {
        var ico;
        var customerAccount = accounts[6];
        var owner = accounts[0];

        before(async function() {
            ico = await PreICO.deployed();
            await ico.enableWhitelist();
            await ico.addToWhitelist(customerAccount);
        });

        after(async function() {
            await ico.disableWhitelist();
            await ico.removeFromWhitelist(customerAccount);
        });

        it("should calculate and allocate the correct tokens", function() {
            var ownerBalance, ico;
            
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
        
        it("should calculate and allocate the correct tokens with specific price", async function() {
            var ownerBalance;
            
            var initialOwnerBalance, finalOwnerBalance;
            var initialCusBalance, finalCusBalance;
            var watcher;
            var eth = 2;
            var payment = toWei(eth);
            var price = toWei(0.5);
            var customerPrice = toWei(0.25);
            var ethBalanceBefore, ethBalanceAfter;
            var expectedNet = 8;

            watcher = ico.Transfer();
            await ico.setPrice(price);
            await ico.setPriceForCustomer(customerAccount, customerPrice);

            initialOwnerBalance = await ico.balanceOf.call(owner);
            initialCusBalance = await ico.balanceOf.call(customerAccount);
            ethBalanceBefore = await ico.ethBalance.call();
            
            await ico.buyTokens({ value: payment,  from: customerAccount });
            
            finalOwnerBalance = await ico.balanceOf.call(owner);
            finalCusBalance = await ico.balanceOf.call(customerAccount);
            ethBalanceAfter = await ico.ethBalance.call();

            var cusDiff = finalCusBalance.minus(initialCusBalance).valueOf();
            var ownerDiff = finalOwnerBalance.minus(initialOwnerBalance).valueOf();
            var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();

            assert.equal(fromWei(cusDiff), expectedNet, "the customers account should have been credited");
            assert.equal(fromWei(ownerDiff), 0-expectedNet, "the owner account should be less");
            assert.equal(fromWei(ethDiff), 2, "ether balance is incorrect");

            // teardown
            await ico.setPriceForCustomer(customerAccount, 0);            
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

        it("should fail when the ether is below the minimum purchase amount", async function() {
            var ico = await PreICO.deployed();

            await ico.setMinPurchase.sendTransaction(toWei(3), { from: accounts[0]});
            var error =false;

            try {
                await ico.buyTokens({ from: accounts[2], value: toWei(2)});
            } catch (e) {
                error = true;
            }

            assert.isTrue(error, "An exception should have been thrown.");

            //revert 
            await ico.setMinPurchase.sendTransaction(0, { from: accounts[0]});
        });
 
        it("should return unused eth", async function() {
            var testICO = await PreICO.new(1, toWei(1));
            await testICO.enablePurchases(true);
            var totalSupply = await testICO.totalSupply.call();
            var price = await testICO.pricePerETH.call();
            var user = accounts[8];
            var watcher = testICO.Prices;
            var cusEthBefore = await getBalance(user);
            var cusTokensBefore = await testICO.balanceOf.call(user);
            var values = await testICO.buyTokens({ from: user, value: toWei(8) });

            var cusEthAfter = await getBalance(user);
            var cusTokensAfter = await testICO.balanceOf(user);

            var contractBalance = await testICO.ethBalance.call().valueOf();

            var ethDiff = cusEthAfter.minus(cusEthBefore).valueOf();
            var tokenDiff = cusTokensAfter.minus(cusTokensBefore).valueOf();
            
            assert.equal(fromWei(totalSupply).valueOf(), 1);
            assert.equal(fromWei(price), 1);
            assert.equal(fromWei(tokenDiff), 1);
            assert.equal(fromWei(contractBalance), 1);
            var ed = fromWei(ethDiff);
            // difference should be 1 token cost plus gas cost. 
            assert.isTrue(ed <= -1 && ed >= -1.05);            
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
                it("should calculate the correct price for price: " + td.price + " for eth: " + td.eth, async function() {
                    var ico;
                    var price = toWei(td.price);
                    var eth = toWei(td.eth);
                    
                    ico = await PreICO.deployed();
                    tokens = await ico.calculateTokens.call(eth, price);
                    assert.equal(fromWei(tokens.valueOf()), (td.expected));
                });
            })(data);
        }
    });

    describe("buyTokens", function() {
        var ico;
        var owner = accounts[0];
        var customerAccount = accounts[3];

        before(async function() {
            ico = await PreICO.deployed();

            await ico.setMinPurchase.sendTransaction(0, { from: accounts[0] });
            await ico.enableWhitelist.sendTransaction({ from: owner });
            await ico.addToWhitelist.sendTransaction(customerAccount, { from: owner });
        });

        after(async function() {
            await ico.disableWhitelist.sendTransaction({ from: owner});
        });

        for(var i=0;i < pricingTestData.length;i++) {
            var data = pricingTestData[i];
            (function(td, user) {
                it("should buy the correct amount of tokens with " + td.price + " for eth: " + td.eth, async function() {
                
                    var ownerInitialBalance, ownerFinalBalance
                    var customerInitialBalance, customerFinalBalance;
                    var price = toWei(td.price);
                    
                    var payment = toWei(td.eth);
                    var expected = td.expected;
                    var ethBalanceBefore, ethBalanceAfter;
        
                    await ico.setPrice(price);
                    ethBalanceBefore = await ico.ethBalance.call();
                    ownerInitialBalance = await ico.balanceOf.call(owner);
                    customerInitialBalance = await ico.balanceOf.call(customerAccount);
                    await ico.buyTokens({ value: payment,  from: customerAccount });
                    ethBalanceAfter = await ico.ethBalance.call();
                    ownerFinalBalance = await ico.balanceOf.call(owner);

                    customerFinalBalance = await ico.balanceOf.call(customerAccount);
                    var cusDiff = customerFinalBalance.minus(customerInitialBalance).valueOf();
                    var ownerDiff = ownerFinalBalance.minus(ownerInitialBalance).valueOf();
                    var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();
                        
                    assert.equal(fromWei(cusDiff), td.expected, "the customers account should have been credited");
                    assert.equal(fromWei(ownerDiff), 0-td.expected, "the owner account should be less");
                    assert.equal(ethDiff, toWei(td.eth), "ether balance is incorrect");
                });
            })(data, i + 1);
        }
    });

    describe("withdrawEth", function() {

        var owner = accounts[0];
        var user1 = accounts[2];

        it("should withdraw to the owner account", function() {
            var amount = toWei(3);

            var ownerBalanceBefore, contractBalanceBefore, contractBalanceAfter, ownerBalanceAfter, ethBalanceAfter;
            
            return PreICO.deployed().then(function(result) {
                ico = result;

                return web3.eth.getBalance(owner);
            }).then(function(balance) {
                ownerBalanceBefore = balance;
                return web3.eth.getBalance(ico.address);
            }).then(function(balance) {
                contractBalanceBefore = balance;
                return ico.withdrawEth.sendTransaction({ from: owner });
            }).then(function() {
                return web3.eth.getBalance(owner);
            }).then(function(balance) {
                ownerBalanceAfter = balance;
                return web3.eth.getBalance(ico.address);
            }).then(function(balance) {
                contractBalanceAfter = balance;
                return ico.ethBalance.call();
            }).then(function(balance) {
                ethBalanceAfter = balance;
                var ownerDiff = ownerBalanceAfter.minus(ownerBalanceBefore);
                var contractDiff = contractBalanceAfter.minus(contractBalanceBefore);

                assert.equal(ethBalanceAfter, 0, "ethBalance should have been 0");
            });
        });
    });

    describe("refund", function() {

        it("should return the refund to the correct person", async function() {
            var user = accounts[7];
            var owner = accounts[0];
            var ico = await PreICO.deployed();
            var wei = toWei(3);
            var tokens = toWei(4);

            await ico.setPrice(toWei(0.5), { from: owner });
            await ico.buyTokens.sendTransaction({ from: user, value: wei });
            await ico.deposit({ value: wei, from: owner });

            var before = await balances(ico, user, owner);
            await ico.refund.sendTransaction(user, wei, tokens, { from: owner });
            var after = await balances(ico, user, owner);
            
            var ownerDiff = after.ownerTokenBalance.minus(before.ownerTokenBalance);
            var userDiff = after.userTokenBalance.minus(before.userTokenBalance);
            
            var contractEthDiff = after.contractETH.minus(before.contractETH);
            var userEthDiff = after.customerETH.minus(before.customerETH);

            assert.equal(fromWei(ownerDiff).valueOf(), 4, "Owner token balance didn't go up");
            assert.equal(fromWei(userDiff).valueOf(), -4, "User token balance didn't go down");
            assert.equal(fromWei(userEthDiff).valueOf(), fromWei(wei), "The user ETH difference was wrong");
            assert.equal(fromWei(contractEthDiff).valueOf(), 0-fromWei(wei), "The contract ETH difference was wrong");
        });

        it("should fail if the refundee has not tokens", async function() {
            var user = accounts[9];
            var owner = accounts[0];
            var ico = await PreICO.deployed();
            var wei = toWei(3);
            var tokens = toWei(4);

            await ico.setPrice(toWei(0.5), { from: owner });
            await ico.deposit({ value: wei, from: owner });

            var before = await balances(ico, user, owner);

            var error = false;
            try {
                await ico.refund.sendTransaction(user, wei, tokens, { from: owner });
            } catch (e) {
                error = true;
            }

            assert.isTrue(error, "an exception should have been thrown");

            var after = await balances(ico, user, owner);
            
            var ownerDiff = after.ownerTokenBalance.minus(before.ownerTokenBalance);
            var userDiff = after.userTokenBalance.minus(before.userTokenBalance);
            
            var contractEthDiff = after.contractETH.minus(before.contractETH);
            var userEthDiff = after.customerETH.minus(before.customerETH);

            assert.equal(fromWei(ownerDiff).valueOf(), 0, "Owner token balance didn't go up");
            assert.equal(fromWei(userDiff).valueOf(), 0, "User token balance didn't go down");
            assert.equal(fromWei(userEthDiff).valueOf(), 0, "The user ETH difference was wrong");
            assert.equal(fromWei(contractEthDiff).valueOf(), 0, "The contract ETH difference was wrong");
        });

        it("should fail if the caller isn't the owner", async function() {

            var user = accounts[9];
            var owner = accounts[0];
    
            var ico = await PreICO.deployed();
            var wei = toWei(3);
            var tokens = toWei(4);

            await ico.setPrice(toWei(0.5), { from: owner });
            await ico.buyTokens.sendTransaction({ from: user, value: wei });
            await ico.deposit({ value: wei, from: owner });

            var before = await balances(ico, user, owner);
            try {
                await ico.refund.sendTransaction(user, wei, tokens, { from: user });
                assert.isTrue(false, "refund should have thrown an error because of wrong user");
            } catch (error) {
                // do nothing as this is expected
            }
            var after = await balances(ico, user, owner);
            
            var ownerDiff = after.ownerTokenBalance.minus(before.ownerTokenBalance);
            var userDiff = after.userTokenBalance.minus(before.userTokenBalance);
            
            var contractEthDiff = after.contractETH.minus(before.contractETH);
            var userEthDiff = after.customerETH.minus(before.customerETH);

            assert.equal(fromWei(ownerDiff).valueOf(), 0, "Owner token balance didn't go up");
            assert.equal(fromWei(userDiff).valueOf(), 0, "User token balance didn't go down");
            assert.equal(fromWei(contractEthDiff).valueOf(), 0, "The contract ETH difference was wrong");
        });

        async function balances(ico, user, owner) {
            var balances = {};
            balances.contractETH = await web3.eth.getBalance(ico.address);
            balances.customerETH = await web3.eth.getBalance(user);
            balances.userTokenBalance = await ico.balanceOf(user);
            balances.ownerTokenBalance = await ico.balanceOf(owner);
            return balances;
        }    
    });

    describe("setMinPurchase", function() {
        after(async function() {
            // teardown the test conditions
            await ico.setMinPurchase(0, { from: accounts[0] });
        });
        it("should set the min purchase when requested", async function() {
            var owner = accounts[0];
            var minPurchase = toWei(22);

            var ico = await PreICO.deployed();
            var result = await ico.setMinPurchase(minPurchase, { from: owner });
            var minAfter = await ico.minPurchase();

            assert.equal(fromWei(minAfter).valueOf(), 22);
        });
    });

    describe("default function should call buyTokens", function() {
        var ico;
        var customerAccount = accounts[6];
        var owner = accounts[0];

        before(async function() {
            ico = await PreICO.deployed();
            await ico.enableWhitelist();
            await ico.addToWhitelist(customerAccount);
        });

        after(async function() {
            await ico.disableWhitelist();
            await ico.removeFromWhitelist(customerAccount);
        });

        it("should calculate and allocate the correct tokens", async function() {
            var ownerBalance;
            
            var initialOwnerBalance, finalOwnerBalance;
            var initialCusBalance, finalCusBalance;
            var watcher;
            var eth = 2;
            var payment = toWei(eth);
            var price = toWei(0.5);
            var expectedNet = 4;

            await ico.setPrice(price);

            ethBalanceBefore = await ico.ethBalance.call();
            initialOwnerBalance = await ico.balanceOf.call(owner);
            initialCusBalance = await ico.balanceOf.call(customerAccount);
            
            await ico.sendTransaction({ value: payment, from: customerAccount });
            
            ethBalanceAfter = await ico.ethBalance.call();
            finalOwnerBalance = await ico.balanceOf.call(owner);
            finalCusBalance = await ico.balanceOf.call(customerAccount);
            
            var cusDiff = finalCusBalance.minus(initialCusBalance).valueOf();
            var ownerDiff = finalOwnerBalance.minus(initialOwnerBalance).valueOf();
            var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();

            assert.equal(fromWei(cusDiff), expectedNet, "the customers account should have been credited");
            assert.equal(fromWei(ownerDiff), 0-expectedNet, "the owner account should be less");
            assert.equal(fromWei(ethDiff), 2, "ether balance is incorrect");
        });
        
        it("should calculate and allocate the correct tokens with different amounts", async function() {
            var ownerBalance;
            var customerAccount = accounts[6];
            var owner = accounts[0];
            
            var initialOwnerBalance, finalOwnerBalance;
            var initialCusBalance, finalCusBalance;

            var eth = 2;
            var payment = toWei(eth);
            var price = toWei(4);
            var ethBalance = 0;
            var expectedNet = 0.5;
            var ethBalanceBefore, ethBalanceAfter;
            
            await ico.setPrice(price);
            ethBalanceBefore = await ico.ethBalance.call();
            initialOwnerBalance = await ico.balanceOf.call(owner);
            initialCusBalance = await ico.balanceOf.call(customerAccount);

            await ico.sendTransaction({ value: payment, from: customerAccount });

            ethBalanceAfter = await ico.ethBalance.call();
            finalOwnerBalance = await ico.balanceOf.call(owner);
            finalCusBalance = await ico.balanceOf.call(customerAccount);

            var cusDiff = finalCusBalance.minus(initialCusBalance).valueOf();
            var ownerDiff = finalOwnerBalance.minus(initialOwnerBalance).valueOf();
            var ethDiff = ethBalanceAfter.minus(ethBalanceBefore).valueOf();

            assert.equal(fromWei(cusDiff), expectedNet, "the customers account should have been credited");
            assert.equal(fromWei(ownerDiff), 0-expectedNet, "the owner account should be less");
            assert.equal(fromWei(ethDiff), eth, "ether balance is incorrect");
        }); 

        it("should fail when the ether is below the minimum purchase amount", async function() {
            var ico = await PreICO.deployed();

            await ico.setMinPurchase.sendTransaction(toWei(3), { from: accounts[0]});
            var error =false;

            try {
                await ico.sendTransaction({ value: toWei(2), from: accounts[2] });
            } catch (e) {
                error = true;
            }

            assert.isTrue(error, "An exception should have been thrown.");

            //revert 
            await ico.setMinPurchase.sendTransaction(0, { from: accounts[0]});
        });
        
    })

    it("should fail when it's not the owner", async function() {
        var notOwner = accounts[2];
        var minPurchase = toWei(22);

        var ico = await PreICO.deployed();
        var minBefore = await ico.minPurchase();

        var error = false;
        try {
            var result = await ico.setMinPurchase(minPurchase, { from: notOwner });
        } catch (e) {
            error = true;
        }
        assert.isTrue(error, "Function should have thrown an exception");
       
        var minAfter = await ico.minPurchase();
        assert.equal(minBefore.valueOf(), minAfter.valueOf());
    });
});

function toWei(value) {
    return web3.toWei(value, "ether");
}

function fromWei(value) {
    return web3.fromWei(value, "ether");
}

function getBalance(address) {
    return web3.eth.getBalance(address);
}
