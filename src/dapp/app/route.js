app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "partials/home.html",
            controller: "HomeCtrl"
        })
        .when("/admin", {
            templateUrl: "partials/coin-admin.html",
            controller: "CoinAdminCtrl"
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