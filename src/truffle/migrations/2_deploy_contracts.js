var ERC20 = artifacts.require("./ERC20.sol");
var PreICO = artifacts.require("./PreICO.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20);
  deployer.link(ERC20, PreICO);
  deployer.deploy(PreICO);
};
