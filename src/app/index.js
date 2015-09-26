/// <reference path="../../.tmp/typings/tsd.d.ts" />
/// <reference path="main/main.controller.ts" />
/// <reference path="main/all/main.all.controller.ts" />
/// <reference path="main/myposts/main.myposts.controller.ts" />
/// <reference path="main/compose/main.compose.controller.ts" />
/// <reference path="login/login.controller.ts"/>
/// <reference path="signup/signup.controller.ts"/>
/// <reference path="settings/menu/settings.menu.controller.ts"/>
/// <reference path="settings/content/settings.content.controller.ts"/>
/// <reference path="settings/content/children/settings.children.controller.ts"/>
/// <reference path="settings/content/child/settings.child.controller.ts"/>
/// <reference path="settings/content/profile/settings.profile.controller.ts"/>
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/tabmenu/tabmenu.controller.ts"/>
/// <reference path="./auth/services/auth-service.ts"/>
/// <reference path="./facebook/services/facebook-service.ts"/>
var chavo;
(function (chavo) {
    'use strict';
    angular.module('chavo', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'restangular',
        'ui.router',
        'ui.router.tabs',
        'ui.bootstrap',
        'ui.validate',
        'toggle-switch',
        'cfp.loadingBar',
        'ngTagsInput'
    ])
        .service('AuthService', chavo.AuthService)
        .service('FacebookService', chavo.FacebookService)
        .controller('MainController', chavo.MainController)
        .controller('MainAllController', chavo.MainAllController)
        .controller('MainMyPostsController', chavo.MainMyPostsController)
        .controller('DeletePostConfirmModalController', chavo.DeletePostConfirmModalController)
        .controller('MainComposeController', chavo.MainComposeController)
        .controller('LoginController', chavo.LoginController)
        .controller('SignupController', chavo.SignupController)
        .controller('NavbarController', chavo.NavbarController)
        .controller('TabmenuController', chavo.TabmenuController)
        .controller('SettingsMenuController', chavo.SettingsMenuController)
        .controller('SettingsContentController', chavo.SettingsContentController)
        .controller('SettingsProfileController', chavo.SettingsProfileController)
        .controller('SettingsChildrenController', chavo.SettingsChildrenController)
        .controller('SettingsChildController', chavo.SettingsChildController)
        .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
            url: '',
            templateUrl: 'app/main/main.html'
        })
            .state('home.myposts', {
            url: '/myposts',
            templateUrl: 'app/main/myposts/main.myposts.html'
        })
            .state('home.all', {
            url: '/all',
            templateUrl: 'app/main/all/main.all.html'
        })
            .state('home.compose', {
            url: '/compose',
            templateUrl: 'app/main/compose/main.compose.html',
            params: { voice: {} }
        })
            .state('settings', {
            url: '/settings',
            templateUrl: 'app/settings/settings.html'
        })
            .state('settings.profile', {
            url: '/profile',
            templateUrl: 'app/settings/content/profile/settings.profile.html'
        })
            .state('settings.children', {
            url: '/children',
            templateUrl: 'app/settings/content/children/settings.children.html'
        })
            .state('settings.child', {
            url: '/children/:childId',
            templateUrl: 'app/settings/content/child/settings.child.html'
        })
            .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html'
        })
            .state('signup', {
            url: '/signup',
            templateUrl: 'app/signup/signup.html'
        });
        $urlRouterProvider.otherwise('/');
    })
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .run(function ($rootScope, $window) {
        Parse.initialize('FpENpUI2dIIOJu5J4UrssehUKwkB1afjOfEK92Zv', '1Wbddi5o4HemnLkhBCmHov121BuE8qS5d1jxPxKs');
        $rootScope.currentUser = Parse.User.current();
        $window.fbAsyncInit = function () {
            Parse.FacebookUtils.init({
                appId: '1461215587529753',
                xfbml: true,
                version: 'v2.4'
            });
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
})(chavo || (chavo = {}));
