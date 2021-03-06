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

    $scope.next = function(){ $scope.tabIndex++; };
    $scope.reset = function(){
        $scope.tabIndex = 0;
        $scope.submissionState = "none";
    };

    $scope.newRandom = function(){ $scope.lie = Math.random() < 0.25; };

    $scope.submissionState = "none";
    $scope.submit = function(answer){
        $scope.submissionState = "waiting";

        // Calculate person ID
        var hash = window.location.hash.substr(1);
        var personid = parseInt(hash);
        if(isNaN(personid)){ personid = undefined; }

        $http.post("/answer", {answer:answer, personid:personid})
            .then(function(){
                $scope.submissionState = "done";
            }).catch(function(){
                $scope.submissionState = "error";
            });
    };
});

