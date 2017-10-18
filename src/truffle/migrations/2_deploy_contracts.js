var PreICO = artifacts.require("./PreICO.sol");
var BitcoinBridge = artifacts.require("./BitcoinBridge.sol");
var path = require("path");

var fs = require("fs");

module.exports = function(deployer) {
  deployer.deploy(PreICO, 1000000, web3.toWei(2,"ether")).then(function(err, result) {
    var addressData = {};
    addressData.PreICO = {
      address: PreICO.address
    };

    var txt = JSON.stringify(addressData);
    var addressPath = path.join(__dirname, "../../dapp/public/address.json");
    fs.writeFileSync(addressPath, txt, { encoding: "utf-8"});

    var preicopath = path.join(__dirname, "../build/contracts/PreICO.json");
    if (fs.existsSync(preicopath)) {
      fs.createReadStream(preicopath).pipe(fs.createWriteStream('../dapp/public/PreICO.json'));
    } else {
      console.error("PreICO.json wasn't deployed");
    }

    deployer.deploy(BitcoinBridge, PreICO.address, 1000000);

  });
};
