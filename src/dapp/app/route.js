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