var app = angular.module("preico.dapp", ['ngRoute']);

window.addEventListener('load', function () {
    var documentEle = document.getElementsByTagName("body")[0];
    angular.bootstrap(documentEle, ["preico.dapp"]);
});

app.controller("HomeCtrl", ["$scope", "web3", function ($scope, web3) {
    web3.eth.getBalance(web3.eth.coinbase, function (err, response) {
        if (err) {
            return console.error(err);
        }
        $scope.balance = response.toNumber();
        $scope.$apply();
    });
}]);
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/dashboard", {
            templateUrl: "partials/dashboard.html",
            controller: "HomeCtrl"
        })
        .when("/trading", {
            templateUrl: "partials/trading.html",
            controller: "HomeCtrl"
        })
        .when("/voting", {
            templateUrl: "partials/voting.html",
            controller: "HomeCtrl"
        })
        .when("/wallet", {
            templateUrl: "partials/wallet.html",
            controller: "HomeCtrl"
        })
        .otherwise({
            redirectTo: "/home"
        });

    $locationProvider.hashPrefix("");
});
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