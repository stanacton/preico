var ERC20 = artifacts.require("./ERC20.sol");
var PreICO = artifacts.require("./PreICO.sol");

var fs = require("fs");

module.exports = function(deployer) {
  deployer.deploy(ERC20);
  deployer.link(ERC20, PreICO);
  deployer.deploy(PreICO).then(function(err, result) {
    var addressData = {};
    addressData.PreICO = {
      address: PreICO.address
    };

    var txt = JSON.stringify(addressData);
    fs.writeFileSync("../dapp/public/address.json", txt, { encoding: "utf-8"});
    fs.createReadStream('build/contracts/PreICO.json').pipe(fs.createWriteStream('../dapp/public/PreICO.json'));
  });
};
