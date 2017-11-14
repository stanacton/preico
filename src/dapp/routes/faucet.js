var Web3 = require("web3");

var web3;

function getWeb3() {
    if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider("http://testnet.dpactum.io:5545"));
    }

    return web3;
}

async function getEth(args) {
    web3 = getWeb3();

    return new Promise(async function(resolve, reject) {
    //    console.log(web3);
        var amount = web3.utils.toWei(5, "ether");
        web3.eth.personal.unlockAccount("0x12C03Cefac0A4f359956d3d4A41b798FdD2e363F", "hello", function(err) {
            console.log("TO ADDRESS", args.toAddress, err);
            if (err) {
                return reject(err);
            }
            resolve();
          /*  web3.eth.sendTransaction({
                from: "0x12C03Cefac0A4f359956d3d4A41b798FdD2e363F",
                to: args.toAddress,
                value: amount
            }, function (error) {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });*/
        });
    });
}

module.exports = {
    getEth: getEth
};