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
            $scope.buyTokendata = ico.buyTokenData(function (err, details) {
                $scope.contractAddress = details.contractAddress;
                $scope.buyTokenData = details.tranData;
            });
        } else {
            $scope.buyTokendata = ico.buyTokenData(function (err, details) {
                $scope.displayConfirmData = true;
                $scope.contractAddress = details.contractAddress;
                $scope.buyTokenData = details.tranData;
                console.log(ico.contractAddress);
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