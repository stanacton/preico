let express = require('express');
let router = express.Router();
let fs = require("fs");
let path = require("path");
let Web3 = require("web3");

router.get('/config/address', function(req, res) {
    let configPath = path.join(__dirname, "../public/address.json");
    fs.readFile(configPath, { encoding: "utf-8"}, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(501).end();
        }
        let config = JSON.parse(result);
        config.PreICO = config.PreICO || {};
        config.PreICO.address = process.env.PREICO_ADDRESS || config.PreICO.address;

        res.json(config);
    });
});
router.get('/config/preico/abi', function(req, res) {
    let configPath = path.join(__dirname, "../public/PreICO.json");
    fs.readFile(configPath, { encoding: "utf-8"}, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(501).end();
        }
        let config = JSON.parse(result);

        res.json(config.abi);
    });
});
router.get('/config/devbank/abi', function(req, res) {
    let configPath = path.join(__dirname, "../public/DevBank.json");
    fs.readFile(configPath, { encoding: "utf-8"}, function (err, result) {
        if (err) {
            console.error(err);
            return res.status(501).end();
        }
        let config = JSON.parse(result);

        res.json(config.abi);
    });
});

router.get('/devbank/withdraw/:account', function(req, res) {

    var account = req.params.account;
    if (!account || account.length < 30) {
        console.error("address account doesn't appear to be valid");
        res.send("address account doesn't appear to be valid " + account);
        return res.status(501).end();
    }


    var web3 = new Web3(new Web3.providers.HttpProvider("http://testnet.dpactum.io:5545"));
//    var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

    var from, to, amount;
    from = "0x53f31Be941BB9CD1aCfa5Ab9742cA71efb400560";
    to = account;
    amount = 100;

    var amountEth = web3.utils.toWei(amount, "ether");

    web3.eth.personal.unlockAccount(from, "hello", function (err, response) {
        console.log("unlock: ", err, response);
        if (err) {
            console.error(err);
            res.send(err);
            return res.status(501).end();
        }

        if (!response) {
            res.send("There was an error unlocking the account.");
            return res.status(501).end();
        }

        web3.eth.sendTransaction({ "from": from, "to": to, value: amountEth, gas: 30000 }, function (err, response) {
            console.log("SEND TRAN: ", err, response);

            if (err) {
                console.error(err);
                res.send(err);
                return res.status(501).end();
            }

            res.status(200);
            res.send(response);
        });
    });

//web3.personal.unlockAccount("0x53f31Be941BB9CD1aCfa5Ab9742cA71efb400560", "hello");
});


module.exports = router;
