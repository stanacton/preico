var DelegateOwner = artifacts.require("../contracts/DelegateOwner.sol");

contract("DelegateOwner", function (accounts) {
    var ico;
    var owner = accounts[0];
    var user = accounts[2];
    
    before(async function() {
        ico = await DelegateOwner.deployed();
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
                await ico.addDelegate(user, { from: accounts[1] });
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
                await ico.removeDelegate(user, { from: accounts[1] });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an error should have been thrown.");
        });
    });
});

function toWei(value) {
    return web3.toWei(value, "ether");
}

function fromWei(value) {
    return web3.fromWei(value, "ether");
}
