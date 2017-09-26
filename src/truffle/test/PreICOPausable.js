
var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("PreICO when paused", function(accounts) {
    
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

            return ico.pause.sendTransaction({ from: accounts[0] });
        }).then(function() {
            return ico.paused.call();
        }).then(function(result) {
            assert.isTrue(result);
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
        it("should fail if paused", function() {
            var ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var transferAmount = toWei(100);
    
            return PreICO.deployed().then(async function(instance) {
                ico = instance;
                try {
                    await ico.transfer(account_to, transferAmount, {from: account_from});
                    return true;                    
                } catch (error) {
                    return false;
                }
            
            }).then(function(_result) {
                assert.isFalse(_result, "trasfer should have raised an error in pause mode.");
            });
        });
    });

    describe("transferFrom", function() {
        it("should fail if pasued", function() {
            var ico;
            var account_from = accounts[0];
            var account_to = accounts[1];
            var actor = accounts[3];
            var amountToTransfer = toWei(5);
    
            return PreICO.deployed().then(async function(instance) {
                ico = instance;
                try {
                    await ico.approve(actor, amountToTransfer, { from: account_from });
                    return true;
                } catch (error) {
                    return false;
                }
            }).then(async function(result) {
                assert.isFalse(result, "approve should fail when pasued");
                try {
                    await ico.transferFrom(account_from, account_to, amountToTransfer, { from: actor});
                    return true;
                } catch(error) {
                    return false;
                }
            }).then(function(result) {
                assert.isFalse(result, "transferFrom should have failed when pasued.");
            });
        });
    });
 
    describe("approve & allowance", function() {
        it("should fail if paused", function() {
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
            }).then(async function(_allowance) {
                allowanceBeforeAllocation = _allowance;

                try {
                    await ico.approve(spender, spendAmount);
                    return true;
                } catch (error) {
                    return false;
                }
            }).then(function(result) {
                assert.isFalse(result, "approve should have failed when pasued");

                return ico.allowance.call(owner, spender);
            }).then(function(_allowance) {
                allowanceAfterAllocation = _allowance;
                return approval_watcher.get();
            }).then(function(events) {
                assert.equal(allowanceBeforeAllocation, 0, "The initial allowance amount should be zero");
                assert.equal(allowanceAfterAllocation, 0, "The allocation amount is incorrect.");
    
                assert.equal(events.length, 0, "events didn't contain an Approval event");
            });
        });
    });

    describe("buyTokens", function() {
        it("should fail when buying", function() {
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
            var expectedNet = 0;

            return PreICO.deployed().then(function(instance) {
                ico = instance;
                watcher = ico.Transfer();
                
                return ico.setPrice(price);
            }).then(function(_balance) {
                
                return ico.balanceOf.call(owner);
            }).then(function(_balance) {
                initialOwnerBalance = _balance;
                return ico.balanceOf.call(customerAccount);
            }).then(async function(_balance) {
                initialCusBalance = _balance;
                try {
                    await ico.buyTokens({ value: payment,  from: customerAccount });
                    return true;
                } catch(error) {
                    return false;
                }
            }).then(function(result) {
                assert.isFalse(result, "There should have been an error.");

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
                assert.equal(fromWei(ownerDiff), expectedNet, "the owner account should be less");
                assert.equal(fromWei(ethBalance), 0, "ether balance is incorrect");
            });
        });
        
        it("should fail if paused", function() {
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
            var expectedNet = 0;
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
            }).then(async function(_balance) {
                initialCusBalance = _balance;
                try {
                    await ico.buyTokens({ value: payment,  from: customerAccount });
                    return true;
                } catch (error) {
                    return false;
                }
            }).then(function(result) {
                assert.isFalse(result, "buyTokens should have failed if paused");
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
                assert.equal(fromWei(ethDiff), 0, "ether balance is incorrect");
            });
        }); 
    });

    var pricingTestData = [];
    
    pricingTestData.push({ "price": 5, "eth": 5, "expected": 0});
    pricingTestData.push({ "price": 5, "eth": 10, "expected": 0});
    pricingTestData.push({ "price": 5, "eth": 2.5, "expected": 0});
    pricingTestData.push({ "price": 5, "eth": 1, "expected": 0});
    pricingTestData.push({ "price": 1, "eth": 5, "expected": 0});
    pricingTestData.push({ "price": 0.5, "eth": 0.5, "expected": 0});
    pricingTestData.push({ "price": 0.5, "eth": 5, "expected": 0});
    pricingTestData.push({ "price": 0.5, "eth": 1, "expected": 0});
    pricingTestData.push({ "price": 0.6, "eth": 1, "expected": 0});
    
    describe("buyTokens", function() {
        for(var i=0;i < pricingTestData.length;i++) {
            var data = pricingTestData[i];
            (function(td, user) {
                it("should fail and do nothing when " + td.price + " for eth: " + td.eth, function(done) {
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
                    }).then(async function(_balance) {
                        customerInitialBalance = _balance;

                        try {
                            await ico.buyTokens({ value: payment,  from: customerAccount });
                            return true;
                        } catch(error) {
                            return false;
                        }

                    }).then(function(result) {
                        assert.isFalse(result, "buyTokens should have failed when paused");

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
                        assert.equal(ethDiff, toWei(0), "ether balance is incorrect");
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

