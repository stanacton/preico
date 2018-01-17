
var PreICO = artifacts.require("../contracts/PreICO.sol");

contract("Whitelist", function(accounts) {
    var owner = accounts[0];
    var userAddress = accounts[2];
    var whitelistUser = accounts[5];

    it("should compile and deploy!!", async function(){
        var ownerBalance = 0;
        var owner;
        var ico; 
        var ico = await PreICO.deployed();

        assert.isFalse(ico == null);
    });

    describe("addToWhitelist, removeFromWhitelist", function() {

        it("should add address to the whitelist and remove it successfully", async function() {
            var ico = await PreICO.deployed();

            var resultBefore = await ico.whitelist(userAddress, { from: owner });
            assert.isFalse(resultBefore, "the user should not have been on the whitelist");

            await ico.addToWhitelist(userAddress);

            var resultAfter = await ico.whitelist(userAddress);
            assert.isTrue(resultAfter, "The user should be on the whitelist");

            await ico.removeFromWhitelist(userAddress);

            var resultAfterRemove = await ico.whitelist(userAddress);
            assert.isFalse(resultAfterRemove, "The user should not be on the whitelist");
        });
    });

    describe("addToWhitelist", function() {
        it("should fail if the caller isn't the owner", async function() {
            var ico = await PreICO.deployed();
            
            var error = false;
            try {
                await ico.addToWhitelist(userAddress, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected an exception to be thrown");
        });
    });

    describe("removeFromWhitelist", function() {
        it("should fail if the caller isn't the owner", async function() {
            var ico = await PreICO.deployed();
            
            var error = false;
            try {
                await ico.removeFromWhitelist(userAddress, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "expected an exception to be thrown");
        });
    });

    describe("enable and disable whitelist", function() {
        it("should enable then disable the whitelist", async function() {
            var ico = await PreICO.deployed();

            await ico.enableWhitelist();
            var enabled = await ico.whitelistEnabled();

            assert.isTrue(enabled, "Whitelist should have been enabled");

            await ico.disableWhitelist();
            var enabled = await ico.whitelistEnabled();

            assert.isFalse(enabled, "Whitelist should have been disabled");
        });

        it("should fail if it's not the owner", async function() {
            var ico = await PreICO.deployed();

            var error = false;

            try {
                await ico.enableWhitelist({ from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "An exception should have been thrown.");

            var error = false;

            try {
                await ico.disableWhitelist({ from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "An exception should have been thrown.");
        });
    });

    describe("non whitelisted user", function() {
        var ico;
        beforeEach(async function() {
            ico = await PreICO.deployed();
            await ico.enableWhitelist({ from: owner });
        });

        afterEach(async function() {
            await ico.disableWhitelist({from: owner });
        });

        it("should fail calling transfer", async function () {
            var error = false;
            await ico.enableWhitelist({ from: owner });
            await ico.removeFromWhitelist(userAddress);
            try {
                await ico.transfer(accounts[3], 33, { from: userAddress });
                console.log("I did ok");
            } catch(e) {
                error = true;
            }
            
            assert.isTrue(error, "an exception should have been thrown");
        });

        it("should fail calling transferFrom", async function () {
            var error = false;
            try {
                await ico.transferFrom(accounts[3], accounts[3], 33, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an exception should have been thrown");
        });

        it("should fail calling approve", async function () {
            var error = false;
            try {
                await ico.transferFrom(accounts[3], 33, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an exception should have been thrown");
        });

        it("should fail calling increaseApproval", async function () {
            var error = false;
            try {
                await ico.increaseApproval(accounts[3], 33, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an exception should have been thrown");
        });

        it("should fail calling decreaseApproval", async function () {
            var error = false;
            try {
                await ico.decreaseApproval(accounts[3], 33, { from: userAddress });
            } catch(e) {
                error = true;
            }

            assert.isTrue(error, "an exception should have been thrown");
        });
    });
});
