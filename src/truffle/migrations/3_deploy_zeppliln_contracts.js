var PreICOZepplin = artifacts.require("./PreICOZepplin.sol");

var fs = require("fs");

module.exports = function(deployer) {
  
  deployer.deploy(PreICOZepplin).then(function(err, result) {
    var addressData = {};
    addressData.PreICOZepplin = {
      address: PreICOZepplin.address
    };

//    var txt = JSON.stringify(addressData);
  //  fs.writeFileSync("../dapp/public/address.json", txt, { encoding: "utf-8"});
    
    if (fs.exists("build/contracts/PreICOZepplin.json")) {
      fs.createReadStream('build/contracts/PreICOZepplin.json').pipe(fs.createWriteStream('../dapp/public/PreICOZepplin.json'));
    } else {
      console.error("PreICOZepplin.json wasn't deployed");
    }
  });
};
