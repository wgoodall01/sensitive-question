angular.module("questions", ["ngMaterial", "ngMdIcons"])

.controller("resultsCtrl", function($scope, $http){
    $http.get(window.location.href + "/results")
        .then(res => {
            $scope.data = res.data;

            $scope.totalResults = $scope.data.countFalse + $scope.data.countTrue;
            $scope.proportion = $scope.data.countTrue / $scope.totalResults;
            $scope.S = $scope.proportion;
        });

        $scope.ayy = "lmao";
});
