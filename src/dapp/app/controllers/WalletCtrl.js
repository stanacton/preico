app.controller("WalletCtrl", ["$scope", "web3","ico", function ($scope, web3, ico) {
    ico.pricePerETH(function (err, result) {
        if (err) {
            return console.error(err);
        }

        $scope.currentPrice = result.toNumber() / 10000000;
        $scope.$apply();
    });

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
        alert("NOTHING DONE");
    };
}]);