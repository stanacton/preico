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
            assert.equal(ownerBalance.valueOf(), 1000000, "1000000 wasn't the owners balance.");
            assert.equal(owner.valueOf(), accounts[0], "The owner wasn't set to the correct person.");
        }); 
    });

    it("should show the correct total supply", function() {
        return PreICO.deployed.then(function(instance) {
            return instance.totalSupply.call();
        }).then(function(_totalSupply) {
            assert.equal(_totalSupply.valueOf(), 100000, "the total supply was incorret");
        });
    });
});