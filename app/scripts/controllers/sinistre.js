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
        usr.$loaded().then(function (data) {
            $scope.user = data;
            $scope.x = {
                step: data.type + '0'
            };
        });

        var sinistre = $firebaseObject(Ref.child('sinistres/' + $routeParams.id));
        sinistre.$loaded().then(function (data) {
            $scope.sinistre = data;
        });

        $scope.triggerUpload = function (index) {
            angular.element('#my-file' + index).trigger('click');
        };
        $scope.triggerPictureUpload = function () {
            console.log('lol');
            angular.element('#my-picture').trigger('click');
        };

        $scope.addFile = function (files, index) {
            if (files && files[0]) {
                var reader = new FileReader();
                var dataURL;
                reader.onload = function (e) {
                    dataURL = e.target.result;
                    $scope.sinistre.docs[index].file = {
                        name: files[0].name,
                        data: dataURL
                    };
                    $scope.sinistre.$save();
                };
                reader.readAsDataURL(files[0]);
            }
        };

        $scope.seeFile = function (index) {

        };

        $scope.dlFile = function (index) {

        };

        $scope.newReparationName = '';
        $scope.createNewReparation = function (reparationName)  {
            $scope.sinistre.reparation.push({
                name: reparationName,
                validated: false
            });
            $scope.sinistre.$save();
            $scope.newReparationName = '';
        };

        $scope.addPicture = function (files) {
            if (files && files[0]) {
                var reader = new FileReader();
                var dataURL;
                reader.onload = function (e) {
                    dataURL = e.target.result;
                    if (!$scope.sinistre.pictures) {
                        $scope.sinistre.pictures = [];
                        $scope.sinistre.$save();
                    }

                    $scope.sinistre.pictures.push({
                        name: files[0].name,
                        data: dataURL
                    });
                    $scope.sinistre.$save();
                };
                reader.readAsDataURL(files[0]);
            }
        };

        $scope.chatOpen = false;
        $scope.msg = '';
        $scope.pushMessage = function () {
            if ($scope.msg.length > 0) {
                if (!$scope.sinistre.messages) {
                    $scope.sinistre.messages = [];
                }
                $scope.sinistre.messages.push({
                    name: $scope.user.name,
                    msg: $scope.msg
                });
                $scope.sinistre.$save();
                $scope.msg = '';
            }
        };
    });
