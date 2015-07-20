/// <reference path="../../.tmp/typings/tsd.d.ts" />

/// <reference path="main/main.controller.ts" />
/// <reference path="main/all/main.all.controller.ts" />
/// <reference path="main/myposts/main.myposts.controller.ts" />
/// <reference path="main/compose/main.compose.controller.ts" />
/// <reference path="login/login.controller.ts"/>
/// <reference path="settings/menu/settings.menu.controller.ts"/>
/// <reference path="settings/content/settings.content.controller.ts"/>
/// <reference path="settings/content/children/settings.children.controller.ts"/>
/// <reference path="settings/content/child/settings.child.controller.ts"/>
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/tabmenu/tabmenu.controller.ts"/>
/// <reference path="./auth/services/auth-service.ts"/>
/// <reference path="./facebook/services/facebook-service.ts"/>


module chavo {
  'use strict';

  export interface IChavoRootScope extends angular.IRootScopeService {
    currentUser: Parse.User;
    targetChild: Child;
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
    'ui.validate',
    'toggle-switch'
    ])
    .service('AuthService', AuthService)
    .service('FacebookService', FacebookService)
    .controller('MainController', MainController)
    .controller('MainAllController', MainAllController)
    .controller('MainMyPostsController', MainMyPostsController)
    .controller('MainComposeController', MainComposeController)
    .controller('LoginController', LoginController)
    .controller('NavbarController', NavbarController)
    .controller('TabmenuController', TabmenuController)
    .controller('SettingsMenuController', SettingsMenuController)
    .controller('SettingsContentController', SettingsContentController)
    .controller('SettingsProfileController', SettingsProfileController)
    .controller('SettingsChildrenController', SettingsChildrenController)
    .controller('SettingsChildController', SettingsChildController)

  .config(function ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
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
        templateUrl: 'app/main/compose/main.compose.html'
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
      });

    $urlRouterProvider.otherwise('/');
  })
  .run(function($rootScope: IChavoRootScope, $window: any) {
    Parse.initialize('FpENpUI2dIIOJu5J4UrssehUKwkB1afjOfEK92Zv', '1Wbddi5o4HemnLkhBCmHov121BuE8qS5d1jxPxKs');
    $rootScope.currentUser = Parse.User.current();

    // facebook準備
    $window.fbAsyncInit = function() {
      Parse.FacebookUtils.init({
        appId      : '1461215587529753',
        xfbml      : true,
        version    : 'v2.4'
      });
    };

    (function(d: Document, s: string, id: string){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
  });
}
