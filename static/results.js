angular.module("questions", ["ngMaterial", "ngMdIcons"])

.controller("resultsCtrl", function($scope, $http){
    $http.get(window.location.href + "/results")
        .then(res => {
            $scope.data = res.data;
        });

        $scope.ayy = "lmao";
});
