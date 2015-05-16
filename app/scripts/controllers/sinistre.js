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

    $scope.triggerRapport = function () {
        angular.element('#rapport').trigger('click');
    };

    $scope.triggerPictureUpload = function () {
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

    $scope.addRapport = function(files) {
        if (files && files[0]) {
            var reader = new FileReader();
            var dataURL;
            reader.onload = function (e) {
                dataURL = e.target.result;
                $scope.sinistre.rapport = {
                    name: files[0].name,
                    data: dataURL
                };
                $scope.sinistre.$save();
            };
            reader.readAsDataURL(files[0]);
        }
    };

    $scope.newReparationName = '';
    $scope.createNewReparation = function (reparationName)  {
        if (!$scope.sinistre.reparation) {
            $scope.sinistre.reparation = [];
            $scope.sinistre.$save();
        }
        $scope.sinistre.reparation.push({
            name: reparationName,
            validated: false
        });
        $scope.sinistre.$save();
        $scope.newReparationName = '';
    };

    $scope.changeState = function(index) {
        $scope.sinistre.reparation[index].validated = !$scope.sinistre.reparation[index].validated;
        $scope.sinistre.$save();
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

    $scope.toggleRdv = function() {
        $scope.sinistre.close = !$scope.sinistre.close;
        $scope.sinistre.$save();
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

    $scope.proposeRdv = function(date, time) {
        if (!$scope.sinistre.pickup) {
            $scope.sinistre.pickup = {};
            $scope.sinistre.$save();
        }

        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth() + 1).toString();
        var dd  = date.getDate().toString();
        date = yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0]);

        var hours = time.getHours().toString();
        var mins = time.getMinutes().toString();
        time = (hours[1] ? hours : '0' + hours[0]) + ':' + (mins[1] ? mins : '0' + mins[0]);

        $scope.sinistre.pickup.date = date;
        $scope.sinistre.pickup.time = time;
        $scope.sinistre.$save();
    };

    $scope.docname = {text: ''};
    $scope.addDoc = function() {
        console.log($scope.docname);
        if ($scope.docname.text.length > 0) {
            if (!$scope.sinistre.docs) {
                $scope.sinistre.docs = [];
            }
            $scope.sinistre.docs.push({name: $scope.docname.text});
            $scope.sinistre.$save();
            $scope.docname.text = '';
        }
    };
});
