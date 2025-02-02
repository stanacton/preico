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
