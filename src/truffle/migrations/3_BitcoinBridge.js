var BitcoinBridge = artifacts.require("./BitcoinBridge.sol");
var path = require("path");

var fs = require("fs");

module.exports = function(deployer) {
  deployer.deploy(BitcoinBridge);
};
