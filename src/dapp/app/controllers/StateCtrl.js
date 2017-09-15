function StateCtrl($scope, web3, ico) {
    var self = this;


    $scope.existingProvider = web3.existingProvider;

    return self;
}

app.controller("StateCtrl", ["$scope", "web3", "ico", StateCtrl]);