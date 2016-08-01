angular.module("questions", ["ngMaterial", "ngMdIcons"])

.controller("resultsCtrl", function($scope, $http){
    $scope.showResponses = true;
    $scope.showIgnores = false;

    $scope.refresh = function(){
        $http.get(window.location.href + "/results")
            .then(res => {           
                $scope.data = res.data;

                $scope.nonResponseCount = $scope.data.nonResponses.length;

                $scope.totalResults = $scope.data.countFalse + $scope.data.countTrue;
                $scope.proportion = $scope.data.countTrue / $scope.totalResults;
                $scope.S = $scope.proportion;
            });
    };

    $scope.refresh();
});
