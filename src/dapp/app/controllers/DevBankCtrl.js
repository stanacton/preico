app.controller("DevBankCtrl", ['$scope', 'web3', "$http","$q", function ($scope, web3, $http, $q) {
    var DevBank;
    var bank;
    var currentPromise;

    function getBank() {
        if (currentPromise) {
            return currentPromise.promise;
        }

        var deferred = currentPromise || $q.defer();
        currentPromise = deferred;

        if (bank) {
            deferred.resolve(bank);
        } else {
            $http.get("/config/devbank/abi")
                .then(function (result) {
                    DevBank = web3.eth.contract(result.data);

                    return $http.get("/config/address").then(function (result) {
                        var address = result.data;
                        bank = DevBank.at(address.DevBank.address);
                        deferred.resolve(bank);
                    }, function (err) {
                        deferred.reject(err);
                        alert("Couldn't load the DevBank address");
                    });
                }, function (err) {
                    deferred.reject(err);
                    alert("THERE WAS A FATAL ERROR Loading the DevBank!!");
                });
        }

        return deferred.promise;
    }

    var watcher = web3.eth.filter("latest");
    watcher.watch(function (err, result) {
        console.log("Watch data", err, result);
        loadState();
    });

    function loadState() {
        getBank().then(function (bank) {
            bank.currentBalance.call(function (err, result) {
                console.log(err, result);
                if (err) {
                    return console.error(err);
                }


                var eth = web3.fromWei(result, "ether");
                $scope.bankBalance = eth.toNumber();
                $scope.$apply();
            });
        }, function (err) {
            console.error(err);
        });
    }
    loadState();

    $scope.withdraw = function (amount) {
        var weiAmount = web3.toWei(amount, "ether");
        getBank().then(function (bank) {
            console.log(weiAmount, bank);
            bank.withdraw.sendTransaction(weiAmount, function (err, result) {
                console.log(err, result);
            });
        });
    };

    $scope.deposit = function (amount) {
        var weiAmount = web3.toWei(amount, "ether");

        getBank().then(function (bank) {
            console.log(weiAmount);
            bank.deposit.sendTransaction({ value: weiAmount }, function (err, result) {
                console.log(err, result);
            });
        });
    };
}]);
