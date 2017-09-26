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
            withdrawEth: withdrawEth,
            pauseICO: pauseICO,
            unpauseICO: unpauseICO
        };
    }]);
})();