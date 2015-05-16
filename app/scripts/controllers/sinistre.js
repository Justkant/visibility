'use strict';

/**
 * @ngdoc function
 * @name visibilityApp.controller:SinistreCtrl
 * @description
 * # SinistreCtrl
 * Controller of the visibilityApp
 */
angular.module('visibilityApp')
    .controller('SinistreCtrl', function ($scope, $routeParams, $location, user, Ref, $firebaseObject) {
    var usr = $firebaseObject(Ref.child('users/' + user.uid));
    usr.$loaded().then(function(data) {
        $scope.user = data;
        $scope.x = {step: data.type + '0'};
    });

    var sinistre = $firebaseObject(Ref.child('sinistres/' + $routeParams.id));
    sinistre.$loaded().then(function(data) {
        $scope.sinistre = data;
    });

    $scope.triggerUpload = function(index) {
        angular.element('#my-file' + index).trigger('click');
    };

    $scope.addFile = function(files, index) {
        if (files && files[0]) {
            var reader = new FileReader();
            var dataURL;
            reader.onload = function(e) {
                dataURL = e.target.result;
                $scope.sinistre.expertise.docs[index].file = {name: files[0].name, data: dataURL};
                $scope.sinistre.$save();
            };
            reader.readAsDataURL(files[0]);
        }
    };

    $scope.seeFile = function(index) {

    };

    $scope.dlFile = function(index) {

    };

    $scope.chatOpen = false;
    $scope.msg = '';
    $scope.pushMessage = function() {
        console.log($scope.msg);
        if ($scope.msg.length > 0) {
            if (!$scope.sinistre.messages) {
                $scope.sinistre.messages = [];
            }
            $scope.sinistre.messages.push({name: $scope.user.name, msg: $scope.msg});
            $scope.sinistre.$save();
            $scope.msg = '';
        }
    };
});
