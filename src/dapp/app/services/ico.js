(function () {
    app.factory("ico", ["web3", "$http", "$q", "$rootScope", function(web3, $http, $q, $rootScope){
        var ICO, ico;
        function getICO() {
            var deferred = $q.defer();

            if (ico) {
                deferred.resolve(ico);
            } else {
                $http.get("PreICO.json")
                    .then(function (result) {
                        console.log(result.data.abi);
                        ICO = web3.eth.contract(result.data.abi);

                        return $http.get("address.json").then(function (result) {
                            console.log(result.data);
                            var address = result.data;
                            ico = ICO.at(address.PreICO.address);
                            deferred.resolve(ico);
                        });
                    }, function (err) {
                        alert("THERE WAS A FATAL ERROR!!");
                        deferred.reject(err);
                    });
            }

            return deferred.promise;
        }

        function balanceOf(account, next) {
            getICO().then(function (ico) {
                ico.balanceOf(account, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    console.log("balanceof", err, result);

                    next(null, result.toNumber());
                });
            });
        }

        function balance(next) {
            currentAccount(function (err, account) {
                if (err) {
                    return next(err);
                }
                balanceOf(account, next);
            });
        }

        function pricePerETH(next) {
            getICO().then(function (ico) {
                ico.pricePerETH(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, result.toNumber() / 10000000);
                });
            });
        }

        function currentAccount(next) {
            web3.eth.getAccounts(function (err, accounts) {
                if (err) {
                    return next(err);
                }
                next(null, accounts[0]);
            });
        }

        function buyTokens(ethAmount, next) {
            var amount = web3.toWei(ethAmount, 'ether');
            console.log(ico.buyTokens.getData({ value: amount, gas: 28000 }));
            ico.buyTokens.sendTransaction(function (err, result) {
                console.log("REsult was", err, result);
                next(err, result);
            });
        }

        var filter = web3.eth.filter("latest");
        filter.watch(function () {
            $rootScope.$broadcast("new-block");
        });

        return {
            balance: balance,
            balanceOf: balanceOf,
            pricePerETH: pricePerETH,
            buyTokens: buyTokens
        };
    }]);
})();