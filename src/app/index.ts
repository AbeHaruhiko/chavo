/// <reference path="../../.tmp/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="main/main.all.controller.ts" />
/// <reference path="login/login.controller.ts"/>
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/tabmenu/tabmenu.controller.ts"/>
/// <reference path="./auth/services/auth-service.ts"/>


module chavo {
  'use strict';

  export interface IChavoRootScope extends ng.IRootScopeService {
    currentUser: Parse.User;
  }

  angular.module('chavo', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'restangular',
    'ui.router',
    'ui.router.tabs',
    'ui.bootstrap',
    'ui.validate'
    ])
    .service('AuthService',AuthService)
    .controller('MainController', MainController)
    .controller('MainAllController', MainAllController)
    .controller('LoginController', LoginController)
    .controller('NavbarController', NavbarController)
    .controller('TabmenuController', TabmenuController)

  .config(function ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('home.myposts', {
        url: 'myposts',
        templateUrl: 'app/main/main.myposts.html'
      })
      .state('home.all', {
        url: 'all',
        templateUrl: 'app/main/main.all.html',
        controller: 'MainAllController',
        controllerAs: 'main_all'
      })
      .state('home.compose', {
        url: 'all',
        templateUrl: 'app/main/main.compose.html',
        controller: '',
        controllerAs: 'main_all'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      });

    $urlRouterProvider.otherwise('/');
  })
  .run(function($rootScope: IChavoRootScope) {
    Parse.initialize('FpENpUI2dIIOJu5J4UrssehUKwkB1afjOfEK92Zv', '1Wbddi5o4HemnLkhBCmHov121BuE8qS5d1jxPxKs');
    $rootScope.currentUser = Parse.User.current();
  });
}
