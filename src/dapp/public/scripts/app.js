var app = angular.module("preico.dapp", ['ngRoute']);

window.addEventListener('load', function () {
    var documentEle = document.getElementsByTagName("body")[0];
    angular.bootstrap(documentEle, ["preico.dapp"]);
});

app.controller("DashboardCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {
    web3.eth.getBalance(web3.eth.coinbase, function (err, response) {
        if (err) {
            return console.error(err);
        }
        $scope.balance = response.toNumber();
        $scope.$apply();
    });
}]);
app.controller("TradingCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
app.controller("VotingCtrl", ["$scope", "web3", function ($scope, web3) {

}]);
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
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/dashboard", {
            templateUrl: "partials/dashboard.html",
            controller: "DashboardCtrl"
        })
        .when("/trading", {
            templateUrl: "partials/trading.html",
            controller: "TradingCtrl"
        })
        .when("/voting", {
            templateUrl: "partials/voting.html",
            controller: "VotingCtrl"
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
(function (Web3) {
    app.factory("ico", ["web3", function(web3){
        var icoAddress = "0x2ed9b33ac7ed9f965c57d9d33479a5b3e16414de";
        var abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"__totalSupply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pricePerETH","outputs":[{"name":"price","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
        var ICO = web3.eth.contract(abi);
        var ico = ICO.at(icoAddress);

        return ico;
    }]);
})(Web3);
(function (Web3) {
    app.factory("web3", [function(){

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider());
        }

        return web3;
    }]);
})(Web3);