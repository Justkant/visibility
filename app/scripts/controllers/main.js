'use strict';

/**
 * @ngdoc function
 * @name visibilityApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the visibilityApp
 */
angular.module('visibilityApp')
    .controller('MainCtrl', function ($scope, user, Auth, Ref, $firebaseObject, $firebaseArray, $location) {
    $scope.logout = function() {
        Auth.$unauth();
    };

    var usr = $firebaseObject(Ref.child('users/' + user.uid));
    usr.$loaded().then(function(data) {
        $scope.user = data;
    });

    var sinistres = $firebaseArray(Ref.child('sinistres').orderByChild('close').equalTo(false));
    sinistres.$loaded().then(function(data) {
        $scope.sinistres = data.reverse();
    });

    sinistres = $firebaseArray(Ref.child('sinistres').orderByChild('close').equalTo(true));
    sinistres.$loaded().then(function(data) {
        $scope.sinistresClosed = data.reverse();
    });

    $scope.newSinistre = function() {
        var today = new Date();
        $scope.sinistres.$add({date: today.format('dd.mm.yy'), close: false});
    };

    $scope.goToSinister = function($id) {
        $location.path('sinistre/' + $id);
    };
});
