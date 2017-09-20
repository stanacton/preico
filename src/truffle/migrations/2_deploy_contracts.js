var ERC20 = artifacts.require("./ERC20.sol");
var PreICO = artifacts.require("./PreICO.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var SafeMathLib = artifacts.require("./SafeMathLib.sol");
var DevBank = artifacts.require("./DevBank.sol");

var fs = require("fs");

module.exports = function(deployer) {
  deployer.deploy(ERC20);
  deployer.deploy(SafeMath);
  deployer.deploy(SafeMathLib);
  deployer.deploy(DevBank);

  deployer.link(ERC20, PreICO);
  deployer.link(SafeMath, PreICO);
  deployer.link(SafeMathLib, PreICO);
  
  deployer.deploy(PreICO).then(function(err, result) {
    var addressData = {};
    addressData.PreICO = {
      address: PreICO.address
    };

    addressData.DevBank = {
      address: DevBank.address
    };

    var txt = JSON.stringify(addressData);
    fs.writeFileSync("../dapp/public/address.json", txt, { encoding: "utf-8"});
    fs.createReadStream('build/contracts/PreICO.json').pipe(fs.createWriteStream('../dapp/public/PreICO.json'));
    fs.createReadStream('build/contracts/DevBank.json').pipe(fs.createWriteStream('../dapp/public/DevBank.json'));
  });
};
