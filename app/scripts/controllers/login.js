'use strict';
/**
 * @ngdoc function
 * @name visibilityApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('visibilityApp')
    .controller('LoginCtrl', function ($scope, Auth, $location, $q, Ref, $timeout) {
    $scope.passwordLogin = function() {
        $scope.err = null;
        Auth.$authWithPassword({email: $scope.user.email, password: $scope.user.pass},
                               {rememberMe: true}).then(redirect, showError);
    };

    $scope.type = 1;
    $scope.user = {};

    $scope.createAccount = function() {
        $scope.err = null;
        if( !$scope.user.pass ) {
            $scope.err = 'Please enter a password';
        }
        else {
            Auth.$createUser({email: $scope.user.email, password: $scope.user.pass})
                .then(function () {
                // authenticate so we have permission to write to Firebase
                return Auth.$authWithPassword({email: $scope.user.email, password: $scope.user.pass},
                                              {rememberMe: true});
            })
                .then(createProfile)
                .then(redirect, showError);
        }

        function createProfile(user) {
            var ref = Ref.child('users/' + user.uid), def = $q.defer();
            ref.set({email: $scope.user.email,
                     name: firstPartOfEmail($scope.user.email),
                     type: $scope.type}, function(err) {
                $timeout(function() {
                    if( err ) {
                        def.reject(err);
                    }
                    else {
                        def.resolve(ref);
                    }
                });
            });
            return def.promise;
        }
    };

    function firstPartOfEmail(email) {
        return ucfirst(email.substr(0, email.indexOf('@'))||'');
    }

    function ucfirst (str) {
        // inspired by: http://kevin.vanzonneveld.net
        str += '';
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1);
    }



    function redirect() {
        $location.path('/account');
    }

    function showError(err) {
        $scope.err = err;
    }


});
