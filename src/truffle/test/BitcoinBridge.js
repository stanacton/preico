var BitcoinBridge = artifacts.require("../contracts/BitcoinBridge.sol");
var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("BitcoinBridge", function(accounts) {
    var bb;
    var ico;
    var owner = accounts[0];
    var notOwner = accounts[1];

    before(async function() {
        ico = await PreICO.new(1000000000, toWei(2));
        bb = await BitcoinBridge.new(ico.address, toWei(2)); 
        await ico.enablePurchases(true);       
    });

    describe("registerPendingPayment", function() {
        it("should register pending payment and emit event", async function() {
            var address = "mybitcoinaddressmybitcoinaddress";
            var amount = 33;
            var user = accounts[0];

            var watcher = bb.PendingPaymentRegistration();
            await bb.registerPendingPayment(address, amount);

            var events = await watcher.get();
            var pendingPayment = await bb.pendingPayments(user);

            assert.isFalse(pendingPayment == null);
            assert.equal(pendingPayment[0], user, "The user address was wrong.");
            assert.equal(pendingPayment[1], address, "The user address was wrong.");
            assert.equal(pendingPayment[2].valueOf(), amount, "The amount was wrong.");
            assert.isFalse(pendingPayment[3], "Paid should have been false.");

            assert.equal(events.length, 1, "There should be one event.");
            var event = events[0];
            assert.equal(event.args.userAddress, user, "The user address was wrong.");
            assert.equal(event.args.bitcoinAddress, address, "The user address was wrong.");
            assert.equal(event.args.amount.valueOf(), amount, "The amount was wrong.");
        });

        it("should overwrite existing pending payment", async function() {
            var address = "mybitcoinaddressmybitcoinaddress";
            var amount = 33;
            var user = accounts[0];

            var watcher = bb.PendingPaymentRegistration();
            await bb.registerPendingPayment(address, amount);

            var events = await watcher.get();
            var pendingPayment = await bb.pendingPayments(user);

            assert.isFalse(pendingPayment == null);
            assert.equal(pendingPayment[0], user, "The user address was wrong.");
            assert.equal(pendingPayment[1], address, "The user address was wrong.");
            assert.equal(pendingPayment[2].valueOf(), amount, "The amount was wrong.");
            assert.isFalse(pendingPayment[3], "Paid should have been false.");

            assert.equal(events.length, 1, "There should be one event.");
            var event = events[0];
            assert.equal(event.args.userAddress, user, "The user address was wrong.");
            assert.equal(event.args.bitcoinAddress, address, "The user address was wrong.");
            assert.equal(event.args.amount.valueOf(), amount, "The amount was wrong.");

            // do second pending payment
            await bb.registerPendingPayment(address, 333);

            var events = await watcher.get();
            var pendingPayment = await bb.pendingPayments(user);

            assert.isFalse(pendingPayment == null);
            assert.equal(pendingPayment[0], user, "The user address was wrong.");
            assert.equal(pendingPayment[1], address, "The user address was wrong.");
            assert.equal(pendingPayment[2].valueOf(), 333, "The amount was wrong.");
            assert.isFalse(pendingPayment[3], "Paid should have been false.");

            assert.equal(events.length, 1, "There should be one event.");
            var event = events[0];
            assert.equal(event.args.userAddress, user, "The user address was wrong.");
            assert.equal(event.args.bitcoinAddress, address, "The user address was wrong.");
            assert.equal(event.args.amount.valueOf(), 333, "The amount was wrong.");
        });

        it("should fail if ico purchaes are disabled", async function() {
            await ico.enablePurchases(false);
            var user = accounts[2];
            var error = false;
            try {
                await bb.registerPendingPayment.sendTransaction("bitcoinAddressbitcoinAddressbitcoinAddress", 12, {from: user});
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "it should ahve thrown an error");

            await ico.enablePurchases(true);
        });

        it("should fail if it's below minimum purchcase");
    });

    describe("confirmPayment", function() {
        it("should set paid to true", async function() {
            var address = "mybitcoinaddressmybitcoinaddress";
            var amount = 33;
            var user = accounts[1];
            var txId = "txID1234455";

            await bb.registerPendingPayment.sendTransaction(address, amount, { from: user });

            var pendingPayment = await bb.pendingPayments(user);
            assert.isFalse(pendingPayment == null);
            assert.equal(pendingPayment[0], user, "The user address was wrong.");
            assert.equal(pendingPayment[1], address, "The user address was wrong.");
            assert.equal(pendingPayment[2].valueOf(), amount, "The amount was wrong.");
            assert.isFalse(pendingPayment[3], "Paid should have been false.");

            await bb.confirmPayment(user, txId);

            var pendingPayment = await bb.pendingPayments(user);

            assert.isFalse(pendingPayment == null);
            assert.equal(pendingPayment[0], user, "The user address was wrong.");
            assert.equal(pendingPayment[1], address, "The user address was wrong.");
            assert.equal(pendingPayment[2].valueOf(), amount, "The amount was wrong.");
            assert.isTrue(pendingPayment[3], "Paid should have been true.");
            assert.equal(pendingPayment[4], txId, "The txId was incorrect.");
        });

        it("should fail if not the owner", async function() {
            var error = false;
            try {
                await bb.confirmPayment.sendTransaction(notOwner, "tasdfasdf", {from: notOwner});
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected exception");
        });
    });

    describe("setMinPurchase", function() {
        after(async function() {
            // teardown the test conditions
            await bb.setMinPurchase(0, { from: accounts[0] });
        });
        it("should set the min purchase when requested", async function() {
            var owner = accounts[0];
            var minPurchase = toWei(22);

            var ico = await PreICO.deployed();
            var result = await bb.setMinPurchase(minPurchase, { from: owner });
            var minAfter = await bb.minPurchase();

            assert.equal(fromWei(minAfter).valueOf(), 22);
        });

        it("should fail if not the owner", async function() {
            var error = false;
            try {
                await bb.setMinPurchase.sendTransaction(22, {from: notOwner});
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected exception");
        });
    });

    describe("setPrice", function() {
        it("should set the price", async function() {
            await bb.setPrice.sendTransaction(22, {from: owner });

            var price = await bb.pricePerBitcoin();

            assert.equal(price.valueOf(), 22, "The price was incorrect");
        });

        it("should fail if it's not the owner", async function() {
            var notOwner = accounts[1];

            var error = false;
            try {
                await bb.setPrice.sendTransaction(22, { from: notOwner});
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected exception");
        });
    });

    describe("setPriceForCustomer", function() {
        it("should set the price for a specific customer", async function() {
            var user = accounts[3];
            var price = 222;

            await bb.setPriceForCustomer.sendTransaction(user, price, {from: owner});

            var result = await bb.customerPrice(user);

            assert.equal(result, price, "the price was incorrect");

            await bb.setPriceForCustomer.sendTransaction(user, 0, {from: owner});
        });

        it("should fail if it's not the owner", async function() {
            var error = false;
            try {
                await bb.setPriceForCustomer.sendTransaction(notOwner, 0, { from: notOwner});
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected exception");
        });
    });

    describe("calculateTokens", function() {
        var pricingTestData = [];
        
        pricingTestData.push({ "price": 5, "btc": 5, "expected": 1});
        pricingTestData.push({ "price": 5, "btc": 10, "expected": 2});
        pricingTestData.push({ "price": 5, "btc": 2.5, "expected": 0.5});
        pricingTestData.push({ "price": 5, "btc": 1, "expected": 0.2});
        pricingTestData.push({ "price": 1, "btc": 5, "expected": 5});
        pricingTestData.push({ "price": 0.5, "btc": 0.5, "expected": 1});
        pricingTestData.push({ "price": 0.5, "btc": 5, "expected": 10});
        pricingTestData.push({ "price": 0.5, "btc": 1, "expected": 2});
        pricingTestData.push({ "price": 0.6, "btc": 1, "expected": 1.666666666666666666});
        
        for(var i=0;i < pricingTestData.length;i++) {
            var data = pricingTestData[i];
            (function(td) {
                it("should calculate the correct price for price: " + td.price + " for BTC: " + td.btc + " expcted: " + td.expected, async function() {
                    var price = toWei(td.price);
                    var btc = toWei(td.btc);
                    
                    tokens = await bb.calculateTokens.call(btc, price);
                    assert.equal(fromWei(tokens.valueOf()), (td.expected));
                });
            })(data);
        }
    });

    describe("buyTokens", function() {
        it("should buy the required tokens", async function() {
            var user = accounts[2];
            var btc = toWei(2);
            var price = toWei(1);

            await bb.setPrice(btc);

            var userTokensBefore = await ico.balanceOf(user);
            var ownerTokensBefore = await ico.balanceOf(owner);
            var watcher = ico.debug2();
            
            await bb.buyTokens.sendTransaction(user, btc, {from: owner});
            
            var events = await watcher.get();
            console.log(owner, events);
            
            var userTokensAfter  = await ico.balanceOf(user);
            var ownerTokensAfter  = await ico.balanceOf(owner);

            var userDiff = userTokensAfter.minus(userTokensBefore).valueOf();
            var ownerDiff = ownerTokensAfter.minus(ownerTokensBefore).valueOf();

            assert.equal(fromWei(userDiff), 2, "User token difference was wrong");
            assert.equal(fromWei(userDiff), -2, "owner token difference was wrong");

        });

        it("should apply the custom price for a given user");

        it("should fail if it's not the owner");

        it("should fail if not enough tokens are available");

        it("should fail if purchases are disabled");
    });
});

function toWei(value) {
    return web3.toWei(value, "ether");
}

function fromWei(value) {
    return web3.fromWei(value, "ether");
}
