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
            $scope.totalSupply = totalSupply;
            $scope.$apply();
        });
    }

    function symbol() {
        ico.symbol(function (err, data) {
            $scope.symbol = data;
            $scope.$apply();
        });
    }

    function name() {
        ico.name(function (err, name) {
            $scope.name = name;
            $scope.$apply();
        });
    }

    function ethBalance() {
        ico.ethBalance(function (err, data) {
            $scope.ethBalance = data;
            $scope.$apply();
        });
    }

    function tokensSold() {
        ico.tokensSold(function (err, data) {
            $scope.tokensSold = data;
            $scope.$apply();
        });
    }

    function tokensRemaining() {
        ico.tokensRemaining(function (err, data) {
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
