var app = angular.module("preico.dapp", ['ngRoute']);

window.addEventListener('load', function () {
    var documentEle = document.getElementsByTagName("body")[0];
    angular.bootstrap(documentEle, ["preico.dapp"]);
});

app.controller("BalanceCtrl", ['$scope', 'web3', 'ico', function ($scope, web3, ico) {

    $scope.balanceOf = function (address) {
        ico.balanceOf(address, function (err, balance) {
            $scope.result = {
                address: address,
                balance: balance
            };

            $scope.balance = balance;
            $scope.$apply();
            $scope.showBalance = true;
        });
    };
}]);

app.controller("DashboardCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {
    web3.eth.getBalance(web3.eth.coinbase, function (err, response) {
        if (err) {
            return console.error(err);
        }
        $scope.balance = response.toNumber();
        $scope.$apply();
    });
}]);
function StateCtrl($scope, web3, ico) {
    var self = this;


    $scope.existingProvider = web3.existingProvider;

    return self;
}

app.controller("StateCtrl", ["$scope", "web3", "ico", StateCtrl]);
app.controller("TradingCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
app.controller("VotingCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
app.controller("WalletCtrl", ["$scope", "web3","ico","$rootScope", function ($scope, web3, ico, $rootScope) {

    function updateBalance() {
        ico.pricePerETH(function (err, price) {
            if (err) {
                return console.error(err);
            }

            $scope.currentPrice = price;
            $scope.$apply();
        });

        ico.balance(function (err, balance) {
            if (err) {
                $scope.balance = 0;
                console.error(err);
            } else {
                $scope.balance = balance;
            }
            $rootScope.$apply();
        });
    }

    $rootScope.$on("new-block", function () {
        updateBalance();
    });

    updateBalance();

    $scope.updatePrice = function(ethAmount) {
        $scope.tokenAmount = ethAmount / $scope.currentPrice;
        $scope.ethAmount = ethAmount;
    };

    $scope.buy = function () {
        $scope.displayConfirm = true;
    };

    $scope.cancel = function () {
        $scope.displayConfirm = false;
    };

    $scope.confirm = function () {
        ico.buyTokens($scope.ethAmount, function (err, result) {
            console.log("buyTokens", err, result);
            if (err) {
                alert(err);
                return console.error(err);
            }
            alert("You have bought Tokens!!");

            updateBalance();
        });
    };
}]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/dashboard", {
            templateUrl: "partials/dashboard.html",
            controller: "DashboardCtrl"
        })
        .when("/trading", {
            templateUrl: "partials/trading.html",
            controller: "TradingCtrl"
        })
        .when("/voting", {
            templateUrl: "partials/voting.html",
            controller: "VotingCtrl"
        })
        .when("/balance", {
            templateUrl: "partials/balance.html",
            controller: "BalanceCtrl"
        })
        .when("/wallet", {
            templateUrl: "partials/wallet.html",
            controller: "WalletCtrl"
        })
        .otherwise({
            redirectTo: "/home"
        });

    $locationProvider.hashPrefix("");
});
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
                        ICO = web3.eth.contract(result.data.abi);

                        return $http.get("address.json").then(function (result) {
                            var address = result.data;
                            ico = ICO.at(address.PreICO.address);
                            deferred.resolve(ico);
                        }, function (err) {
                            alert("Couldn't load the coin address");
                            deferred.reject(err);
                        });
                    }, function (err) {
                        alert("THERE WAS A FATAL ERROR!!");
                        deferred.reject(err);
                    });
            }

            return deferred.promise;
        }

        function balanceOf(account, next) {
            getICO().then(function (_ico) {
                _ico.balanceOf.call(account, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    next(null, result.toNumber());
                });
            }, function (err) {

                console.error("ASDFSADF", err);
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
            }, function (err) {
                console.error(err);
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
            ico.buyTokens.sendTransaction({}, function (err, result) {
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
(function (Web3) {
    app.factory("web3", [function(){

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
            console.log("webProvider: ", web3.currentProvider);
            web3.existingProvider = true;
        } else {
          //  web3 = new Web3(new Web3.providers.HttpProvider());
            web3.existingProvider = false;
        }

        return web3;
    }]);
})(Web3);