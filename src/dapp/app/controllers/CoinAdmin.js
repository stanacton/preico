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
