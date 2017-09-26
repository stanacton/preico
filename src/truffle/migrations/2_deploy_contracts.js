var PreICO = artifacts.require("./PreICO.sol");
var DevBank = artifacts.require("./DevBank.sol");

var fs = require("fs");

module.exports = function(deployer) {
  deployer.deploy(DevBank);
  
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
    
    if (fs.exists("build/contracts/PreICO.json")) {
      fs.createReadStream('build/contracts/PreICO.json').pipe(fs.createWriteStream('../dapp/public/PreICO.json'));
    } else {
      console.error("PreICO.json wasn't deployed");
    }

    if (fs.exists("build/contracts/DevBank.json")) {
      fs.createReadStream('build/contracts/DevBank.json').pipe(fs.createWriteStream('../dapp/public/DevBank.json'));
    } else {
      console.error("DevBank.json wasn't deployed.");
    }
  });
};
