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
        .when("/balance", {
            templateUrl: "partials/balance.html",
            controller: "BalanceCtrl"
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