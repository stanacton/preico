var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("DelegatableOwnerToken", function (accounts) {
    var ico;
    var owner = accounts[0];
    var user = accounts[2];
    
    beforeEach(async function() {
        ico = await PreICO.deployed();

    });

    describe("addDelegate", function() {
        it("should add a delegate", async function() {
            var isDelegate = await ico.delegates(user);
            assert.isFalse(isDelegate, "isDelegate should be false.");

            await ico.addDelegate(user);

            isDelegate = await ico.delegates(user);
            assert.isTrue(isDelegate, "isDelegate should be true");
        });

        it("should fail if it's not the owner", async function() {
            var error = false;
            try {
                await ico.addDelegate(user, { from: account[1] });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an error should have been thrown.");
        });
    });

    describe("removeDelegate", function() {
        it("should remove a delegate", async function() {
            await ico.addDelegate(user);
            var isDelegate = await ico.delegates(user);
            assert.isTrue(isDelegate, "isDelegate should be true.");

            await ico.removeDelegate(user);

            isDelegate = await ico.delegates(user);
            assert.isFalse(isDelegate, "isDelegate should be false");
        });

        it("should fail if it's not the owner", async function() {
            var error = false;
            try {
                await ico.removeDelegate(user, { from: account[1] });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an error should have been thrown.");
        });
    });

    describe("transferAsDelegate", function()   {
        it("should transfer on behalf of the owner", async function() {
            var ownerBalanceBefore, ownerBalanceAfter;
            var cusBalanceBefore, cusBalanceAfter;
            var tokens = toWei(3);
            var delegate = accounts[4];
            var customer = accounts[5];
            var watcher;

            await ico.addDelegate(delegate);

            ownerBalanceBefore = await ico.balanceOf(owner);
            cusBalanceBefore = await ico.balanceOf(customer);
            
            watcher = await ico.Transfer();

            await ico.transferAsDelegate(customer, tokens, { from: delegate });

            ownerBalanceAfter = await ico.balanceOf(owner);
            cusBalanceAfter = await ico.balanceOf(customer);

            var ownerDiff = ownerBalanceAfter.sub(ownerBalanceBefore).valueOf();
            var cusDiff = cusBalanceAfter.sub(cusBalanceBefore).valueOf();
            var events = await watcher.get();

            assert.equal(fromWei(ownerDiff), -3, "Owner balance should have changed");
            assert.equal(fromWei(cusDiff), 3, "Customer balance should have changed");
            
            assert.equal(events.length, 1, "events didn't contain an transfer event");
            assert.equal(events[0].args.from, owner, "the from account was incorrect");
            assert.equal(events[0].args.to, customer, "the to account was incorrect");
            assert.equal(fromWei(events[0].args.value).valueOf(), 3, "the value was incorrect");
        });

        it("should fail if it's not the owner or delegate", async function() {
            var tokens = toWei(3);
            var delegate = accounts[4];
            var customer = accounts[5];

            await ico.addDelegate(delegate);

            var error = false;
            try {
                await ico.transferAsDelegate(customer, tokens, { from: customer });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "Error should have thrown an exception");
        });
    });
});

function toWei(value) {
    return web3.toWei(value, "ether");
}

function fromWei(value) {
    return web3.fromWei(value, "ether");
}
