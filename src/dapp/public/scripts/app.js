var app = angular.module("preico.dapp", ['ngRoute']);

window.addEventListener('load', function () {
    var documentEle = document.getElementsByTagName("body")[0];
    angular.bootstrap(documentEle, ["preico.dapp"]);
});

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

    function owner() {
        ico.owner(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.owner = data;
            $scope.$apply();
        });
    }

    function minPurchase() {
        ico.minPurchase(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.minPurchase = data;
            $scope.$apply();
        });
    }

    function purchasesEnabled() {
        ico.purchasesEnabled(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.purchasesEnabled = data;
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

    function whitelistEnabled() {
        ico.whitelistEnabled(function (err, data) {
            if (err) {
                return console.error(err);
            }
            $scope.whitelistEnabled = data;
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

    $scope.enablePurchases = function (enabled) {
        ico.enablePurchases(enabled, function (err) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if purchases were enabled.");
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

    $scope.setPriceForCustomer = function (userAddress, price) {
        if (!userAddress) {
            return alert( "User Address is required.");
        }

        if (!price) {
            return alert( "price is required.");
        }


        ico.setPriceForCustomer(userAddress, price, function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the custom price setting was successful.");
        });
    };

    $scope.takeOwnership = function () {
        console.log("taking ownership");
        ico.takeOwnership(function (err) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the ownership has changed.");
        });
    };

    $scope.setMinPurchase = function (amount) {
        console.log("setMinPurchase");
        ico.setMinPurchase(amount, function (err) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the minPurchase amount has changed.");
        });
    };

    $scope.withdrawEth = function () {
        ico.withdrawEth(function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the withdraw was successful.");
        });
    };

    $scope.refund = function (details) {
        ico.refund(details, function (err, response) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Refund txId", response);

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the withdraw was successful.");
        });
    };

    $scope.enableWhitelist = function () {
        ico.enableWhitelist(function (err, response) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Refund txId", response);

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the Enable Whitelist was successful.");
        });
    };

    $scope.disableWhitelist = function () {
        ico.disableWhitelist(function (err, response) {
            if (err) {
                alert(err);
                return;
            }
            console.log("Refund txId", response);

            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the Disable Whitelist was successful.");
        });
    };

    $scope.addToWhitelist = function (address) {
        $scope.showCheckResult = false;
        ico.addToWhitelist(address, function (err) {
            if (err) {
                alert(err);
                return;
            }
            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the withdraw was successful.");
        });
    };

    $scope.removeFromWhitelist = function (address) {
        $scope.showCheckResult = false;
        ico.removeFromWhitelist(address, function (err) {
            if (err) {
                alert(err);
                return;
            }
            alert("The transaction has been submitted.  Please wait till the next blocks are mined and check if the withdraw was successful.");
        });
    };

    $scope.checkWhitelistStatus = function (address) {
        $scope.showCheckResult = false;
        $scope.userWhitelistStatus = undefined;
        $scope.checkAddress = address;
        ico.checkWhitelistStatus(address, function (err, response) {
            if (err) {
                alert(err);
                return;
            }
            console.log(response);
            $scope.userWhitelistStatus = response;
            $scope.showCheckResult = true;
            $scope.$apply();
        });
    };

    $scope.checkPriceForCustomer = function (address) {

        $scope.showPriceCheckResult = false;
        $scope.priceCheckAddress = address;
        ico.checkPriceForCustomer(address, function (err, response) {
            if (err) {
                alert(err);
                return;
            }

            $scope.customPrice = response;
            $scope.showPriceCheckResult = true;
            $scope.$apply();
        });
    };

    $scope.claimOwnership = function() {
        ico.claimOwnership(function(err, response) {
            if (err) {
                alert(err);
                return;
            }
            alert("Transaction Sent");

            $scope.$apply();
        });
    };

    $scope.transferOwnership = function(newAddress) {
        if (!newAddress) {
            return alert("newAddress is required.");
        }

        ico.transferOwnership(newAddress, function(err, response) {
            if (err) {
                alert(err);
                return;
            }
            alert("Transaction Sent");
            $scope.$apply();
        });
    };

    $scope.getUserTransactions = function(userAddress) {
        userAddress = "dummy";
        if (!userAddress) {
            return alert("userAddress is required");
        }

        ico.getUserTransactions(userAddress, function (err, response) {
            if (err) {
                return alert(err);
            }

            console.log(JSON.stringify(response, null, 4));
        });
    };

    $scope.getPurchases = function(userAddress) {
        userAddress = null;
/*
        if (!userAddress) {
            return alert("userAddress is required");
        }
*/

        ico.getPurchases(userAddress, function (err, response) {
            if (err) {
                return alert(err);
            }

            console.log(JSON.stringify(response, null, 4));
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
        owner();
        minPurchase();
        purchasesEnabled();
        whitelistEnabled();
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

app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
function StateCtrl($scope, web3, ico) {
    var self = this;


    $scope.existingProvider = web3.existingProvider;

    return self;
}

app.controller("StateCtrl", ["$scope", "web3", "ico", StateCtrl]);
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

            ico.checkPriceForCustomer(web3.eth.accounts[0], function (err, result) {
                if (result > 0) {
                    $scope.currentPrice = result;
                    $scope.$apply();
                }
            });

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

    updateData();

    function updateData() {
        updateBalance();
       // updatePrice();
    }

    $scope.updatePrice = function(ethAmount) {
        $scope.tokenAmount = ethAmount / $scope.currentPrice;
        $scope.ethAmount = ethAmount;
    };

    $scope.buy = function () {
        if (web3.existingProvider) {
            $scope.displayConfirm = true;
            $scope.buyTokendata = ico.buyTokenData(function (err, details) {
                $scope.contractAddress = details.contractAddress;
                $scope.buyTokenData = details.tranData;
            });
        } else {
            $scope.buyTokendata = ico.buyTokenData(function (err, details) {
                $scope.displayConfirmData = true;
                $scope.contractAddress = details.contractAddress;
                $scope.buyTokenData = details.tranData;
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
        .when("/admin", {
            templateUrl: "partials/coin-admin.html",
            controller: "CoinAdminCtrl"
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

        function withdrawEth(next) {
            ico.withdrawEth.sendTransaction(next);
        }

        function takeOwnership(next) {
            ico.takeOwnership.sendTransaction(next);
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
                var details = {};
                details.tranData = ico.buyTokens.getData();
                details.contractAddress = ico.contractAddress;

                if (next) {
                    next(null, details);
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

        function setPriceForCustomer(customerAddress, price, next) {
            var wei = web3.toWei(price, "ether");
            ico.setPriceForCustomer.sendTransaction(customerAddress, wei, function (err, result) {
                next(err, result);
            });
        }

        function enableWhitelist(next) {
            ico.enableWhitelist.sendTransaction(next);
        }

        function disableWhitelist(next) {
            ico.disableWhitelist.sendTransaction(next);
        }

        function addToWhitelist(address, next) {
            ico.addToWhitelist.sendTransaction(address, next);
        }

        function removeFromWhitelist(address, next) {
            ico.removeFromWhitelist.sendTransaction(address, { gas: 40000 }, next);
        }

        function setMinPurchase(price, next) {
            var wei = web3.toWei(price, "ether");
            ico.setMinPurchase.sendTransaction(wei, function (err, result) {
                next(err, result);
            });
        }

        function refund(details, next) {
            if (!details.userAddress) {
                return next({message: "details.userAddress is required."});
            }
            if (!details.ethAmount) {
                return next({message: "details.ethAmount is required."});
            }
            if (!details.tokenAmount) {
                return next({message: "details.tokenAmount is required."});
            }


            var wei = web3.toWei(details.ethAmount, "ether");
            var tokens = web3.toWei(details.tokenAmount, "ether");

            ico.refund.sendTransaction(details.userAddress, wei, tokens, function (err, result) {
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

        function checkWhitelistStatus(address, next) {
            getICO().then(function (ico) {
                ico.whitelist(address, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, (result));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function checkPriceForCustomer(address, next) {
            getICO().then(function (ico) {
                ico.customerPrice(address, function (err, result) {
                    if (err) {
                        return next(err);
                    }

                    next(null, web3.fromWei(result));
                });
            }, function (err) {
                console.error(err);
            });
        }

        function whitelistEnabled(next) {
            getICO().then(function (ico) {
                ico.whitelistEnabled(function (err, result) {
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

        function owner(next) {
            getICO().then(function (ico) {
                ico.owner(function (err, result) {
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

        function purchasesEnabled(next) {
            getICO().then(function (ico) {
                ico.purchasesEnabled(next);
            });
        }

        function enablePurchases(enabled, next) {
            getICO().then(function (ico) {
                ico.enablePurchases(enabled, next);
            });
        }

        function minPurchase(next) {
            getICO().then(function (ico) {
                ico.minPurchase(function (err, result) {
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

        function transferOwnership(newOwner, next) {
            if (!newOwner) {
                return next({message: "newOwner is required."});
            }

            getICO().then(function (ico) {
                ico.transferOwnership.sendTransaction(newOwner, next);
            });
        }

        function claimOwnership(next) {
            getICO().then(function (ico) {
                ico.claimOwnership.sendTransaction(next);
            });
        }

        function getUserTransactions(userAddress, next) {
            getICO().then(function (ico) {
                ico.Transfer({to: "0x2175f98baf93c4ed810c71a1e0e9dfbc080fe994"}, {fromBlock: '0', toBlock: 'latest' })
                    .get(function(err, results) {
                  if (err) {
                      return next(err);
                  } else {
                      if (!Array.isArray(results)) return next("unexpected results format");

                    var mapped = results.map(function (value) {
                        return {
                            from: value.args.from,
                            to: value.args.to,
                            value: web3.fromWei(value.args.value).valueOf(),
                            blockHash: value.blockHash,
                            blockNumber: value.blockNumber,
                            transactionHash: value.transactionHash
                        };
                    });

                      next(null, mapped);
                  }
                });
            });
        }

        function getPurchases(userAddress, next) {
            getICO().then(function (ico) {
                ico.Purchased({to: userAddress}, {fromBlock: '0', toBlock: 'latest' })
                    .get(function(err, results) {
                  if (err) {
                      return next(err);
                  } else {
                      if (!Array.isArray(results)) return next("unexpected results format");

                    var mapped = results.map(function (value) {
                        return {
                            user: value.args.user,
                            tokens: web3.fromWei(value.args.tokens).valueOf(),
                            price: web3.fromWei(value.args.tokens).valueOf(),
                            blockHash: value.blockHash,
                            blockNumber: value.blockNumber,
                            transactionHash: value.transactionHash
                        };
                    });

                      next(null, mapped);
                  }
                });
            });
        }

        return {
            balance: balance,
            balanceOf: balanceOf,
            pricePerETH: pricePerETH,
            buyTokens: buyTokens,
            setPrice: setPrice,
            setMinPurchase: setMinPurchase,
            totalSupply: totalSupply,
            name: name,
            addToWhitelist: addToWhitelist,
            removeFromWhitelist: removeFromWhitelist,
            whitelistEnabled: whitelistEnabled,
            checkWhitelistStatus: checkWhitelistStatus,
            paused: paused,
            symbol: symbol,
            purchasesEnabled: purchasesEnabled,
            enablePurchases: enablePurchases,
            refund: refund,
            minPurchase: minPurchase,
            owner: owner,
            tokensSold: tokensSold,
            tokensRemaining: tokensRemaining,
            ethBalance: ethBalance,
            buyTokenData: buyTokenData,
            withdrawEth: withdrawEth,
            enableWhitelist: enableWhitelist,
            disableWhitelist: disableWhitelist,
            pauseICO: pauseICO,
            takeOwnership: takeOwnership,
            setPriceForCustomer: setPriceForCustomer,
            checkPriceForCustomer: checkPriceForCustomer,
            unpauseICO: unpauseICO,
            claimOwnership: claimOwnership,
            transferOwnership: transferOwnership,
            getPurchases: getPurchases,
            getUserTransactions: getUserTransactions
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