angular.module("questions", ["ngMaterial", "ngMdIcons"])

.controller("qCtrl", function($scope, $http){

    $http.get("/question")
        .then(function(res){
            $scope.question = res.data.question;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.tabIndex = 0;

    $scope.next = () => { $scope.tabIndex++; };
    $scope.reset = () => {
        $scope.tabIndex = 0;
        $scope.submissionState = "none";
    };

    $scope.newRandom = () => { $scope.lie = Math.random() < 0.25; };

    $scope.submissionState = "none";
    $scope.submit = function(answer){
        $scope.submissionState = "waiting";
        $http.post("/answer", {answer:answer})
            .then(function(){
                $scope.submissionState = "done";
            }).catch(function(){
                $scope.submissionState = "error";
            });
    };
});

