app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {
    web3.eth.getBalance(web3.eth.coinbase, function (err, response) {
        if (err) {
            return console.error(err);
        }
        $scope.balance = response.toNumber();
        $scope.$apply();
    });
}]);