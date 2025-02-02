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