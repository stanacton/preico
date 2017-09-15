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
