angular.module('firebase.config', [])
  .constant('FBURL', 'https://visibility-axa.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['password'])

  .constant('loginRedirectPath', '/login');
