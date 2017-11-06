var PreICO = artifacts.require("./PreICO.sol");
var DelegateOwner = artifacts.require("./DelegateOwner.sol");
var path = require("path");

var fs = require("fs");

module.exports = function(deployer) {
    deployer.deploy(DelegateOwner);
};
