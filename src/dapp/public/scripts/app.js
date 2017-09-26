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

app.controller("CoinAdminCtrl", ['$scope', 'web3', 'ico', '$rootScope', function ($scope, web3, ico, $rootScope) {


    function updatePrice() {
        ico.pricePerETH(function (err, result) {
            if (err) {
                return console.error(err);
            }

            $scope.price = result;
            $scope.$apply();
        });
    }

    function getTotalSupply() {
        ico.totalSupply(function (err, totalSupply) {
            if (err) {
                return console.error(err);
            }
            $scope.totalSupply = totalSupply;
            $scope.$apply();
        });
    }

    function paused() {
        ico.paused(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.paused = data;
            $scope.$apply();
        });
    }

    function symbol() {
        ico.symbol(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.symbol = data;
            $scope.$apply();
        });
    }

    function name() {
        ico.name(function (err, name) {
            if (err) {
                return console.error(err);
            }
            $scope.name = name;
            $scope.$apply();
        });
    }

    function ethBalance() {
        ico.ethBalance(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.ethBalance = data;
            $scope.$apply();
        });
    }

    function tokensSold() {
        ico.tokensSold(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.tokensSold = data;
            $scope.$apply();
        });
    }

    function tokensRemaining() {
        ico.tokensRemaining(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.tokensRemaining = data;
            $scope.$apply();
        });
    }

    $scope.updatePrice = function (newPrice) {
        ico.setPrice(newPrice, function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            alert("Your transaction has been submitted");
        });
    };

    $scope.pause = function () {
        ico.pauseICO(function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the pause was successful.");
        });
    };

    $scope.unpause = function () {
        ico.unpauseICO(function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the unpause was successful.");
        });
    };

    $rootScope.$on("new-block", function (event) {
        updateDetails();
    });

    function updateDetails() {
        updatePrice();
        getTotalSupply();
        name();
        symbol();
        ethBalance();
        tokensSold();
        tokensRemaining();
        paused();
    }

    updateDetails();

    $scope.setPrice = function (price) {
        ico.setPrice(price, function (err, response) {
            if (err) {
                alert("There was an error setting the price.");
                console.error(err);
                return;
            }

            alert("Transaction Submitted");
        });
    };

}]);

app.controller("DashboardCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
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

app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {

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
        if (!web3.existingProvider) {
            return;
        }

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
        if (web3.existingProvider) {
            $scope.displayConfirm = true;
        } else {
            $scope.buyTokendata = ico.buyTokenData(function (err, data) {
                $scope.displayConfirmData = true;
                $scope.contractAddress = ico.contractAddress;
                $scope.buyTokenData = data;
                console.log(ico.contractAddress);
               // $scope.$apply();
            });
        }
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
        .when("/admin", {
            templateUrl: "partials/coin-admin.html",
            controller: "CoinAdminCtrl"
        })
        .when("/dev-bank", {
            templateUrl: "partials/dev-bank.html",
            controller: "DevBankCtrl"
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
                $http.get("/config/preico/abi")
                    .then(function (result) {
                        ICO = web3.eth.contract(result.data);

                        return $http.get("/config/address").then(function (result) {
                            var address = result.data;
                            ico = ICO.at(address.PreICO.address);
                            ico.contractAddress = address.PreICO.address;
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

        function decimals(value) {
            return web3.fromWei(value, "ether");
        }

        function balanceOf(account, next) {
            getICO().then(function (_ico) {
                _ico.balanceOf.call(account, function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    console.log("balance", result.toNumber());
                    next(null, decimals(result.toNumber()));
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

                    next(null, decimals(result.toNumber()));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function totalSupply(next) {
            getICO().then(function (ico) {
                ico.totalSupply(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, decimals(result.toNumber()));
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
            var wei = web3.toWei(ethAmount, "ether");
            ico.buyTokens.sendTransaction({ value: wei }, function (err, result) {
                next(err, result);
            });
        }

        function pauseICO(next) {
            ico.pause.sendTransaction(next);
        }

        function unpauseICO(next) {
            ico.unpause.sendTransaction(next);
        }

        function buyTokenData(next) {
            getICO().then(function (ico) {
                var tranData = ico.buyTokens.getData();
                if (next) {
                    next(null, tranData);
                } else {
                    return tranData;
                }
            });
        }

        function setPrice(price, next) {
            var wei = web3.toWei(price, "ether");
            ico.setPrice.sendTransaction(wei, { gas: 30000 }, function (err, result) {
                next(err, result);
            });
        }

        var filter = web3.eth.filter("latest");
        filter.watch(function (data) {
            console.log(data);
            $rootScope.$broadcast("new-block");
            getICO().then(function (_ico) {
                ico.ethBalance.call(function (err, result) {
                    console.log(err, result.toNumber());
                });
            }, function (err) {
                console.error(err);
            });
        });

        function name(next) {
            getICO().then(function (ico) {
                ico.name(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, (result));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function symbol(next) {
            getICO().then(function (ico) {
                ico.symbol(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, (result));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function paused(next) {
            getICO().then(function (ico) {
                ico.paused(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, (result));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function ethBalance(next) {
            getICO().then(function (ico) {
                ico.ethBalance(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, web3.fromWei(result.toNumber(), "ether"));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function tokensSold(next) {
            getICO().then(function (ico) {
                ico.tokensSold(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, web3.fromWei(result.toNumber(), "ether"));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function tokensRemaining(next) {
            getICO().then(function (ico) {
                ico.tokensRemaining(function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, web3.fromWei(result.toNumber(), "ether"));
                });
            }, function (err) {
                console.error(err);
            });
        }


        return {
            balance: balance,
            balanceOf: balanceOf,
            pricePerETH: pricePerETH,
            buyTokens: buyTokens,
            setPrice: setPrice,
            totalSupply: totalSupply,
            name: name,
            paused: paused,
            symbol: symbol,
            tokensSold: tokensSold,
            tokensRemaining: tokensRemaining,
            ethBalance: ethBalance,
            buyTokenData: buyTokenData,
            pauseICO: pauseICO,
            unpauseICO: unpauseICO
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
            web3 = new Web3();
            web3.existingProvider = false;
        }

        return web3;
    }]);
})(Web3);