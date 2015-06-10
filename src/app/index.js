/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="main/main.controller.ts" />
/// <reference path="../app/components/navbar/navbar.controller.ts" />
var chavo;
(function (chavo) {
    'use strict';
    angular.module('chavo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap'])
        .controller('MainController', chavo.MainController)
        .controller('NavbarController', chavo.NavbarController)
        .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        });
        $urlRouterProvider.otherwise('/');
    });
})(chavo || (chavo = {}));
