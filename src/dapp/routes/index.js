let express = require('express');
let router = express.Router();
let fs = require("fs");
let path = require("path");

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


module.exports = router;
