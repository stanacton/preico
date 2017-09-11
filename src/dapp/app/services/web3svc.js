(function (Web3) {
    app.factory("web3", [function(){

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider());
        }

        return web3;
    }]);
})(Web3);