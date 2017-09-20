(function (Web3) {
    app.factory("web3", [function(){
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            console.log("webProvider: ", web3.currentProvider);
            web3.existingProvider = true;
        } else {
            web3 = new Web3();
            web3.existingProvider = false;
        }

        return web3;
    }]);
})(Web3);