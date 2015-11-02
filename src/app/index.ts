/// <reference path="../../.tmp/typings/tsd.d.ts" />

/// <reference path="top/top.controller.ts" />
/// <reference path="main/main.controller.ts" />
/// <reference path="main/all/main.all.controller.ts" />
/// <reference path="main/myposts/main.myposts.controller.ts" />
/// <reference path="main/tag/main.tag.controller.ts" />
/// <reference path="main/user/main.user.controller.ts" />
/// <reference path="main/compose/main.compose.controller.ts" />
/// <reference path="main/post/main.post.controller.ts" />
/// <reference path="login/login.controller.ts"/>
/// <reference path="signup/signup.controller.ts"/>
/// <reference path="settings/menu/settings.menu.controller.ts"/>
/// <reference path="settings/content/settings.content.controller.ts"/>
/// <reference path="settings/content/children/settings.children.controller.ts"/>
/// <reference path="settings/content/child/settings.child.controller.ts"/>
/// <reference path="settings/content/profile/settings.profile.controller.ts"/>
/// <reference path="settings/content/family/settings.family.controller.ts"/>
/// <reference path="settings/content/family_application/settings.family_application.controller.ts"/>
/// <reference path="settings/content/family_approval/settings.family_approval.controller.ts"/>
/// <reference path="../app/components/navbar/navbar.controller.ts" />
/// <reference path="../app/components/tabmenu/tabmenu.controller.ts"/>
/// <reference path="./auth/services/auth-service.ts"/>
/// <reference path="./facebook/services/facebook-service.ts"/>
/// <reference path="./components/whenscroll/whenscroll.ts"/>


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
    'toggle-switch',
    'cfp.loadingBar',
    'ngTagsInput'
    ])
    .service('AuthService', AuthService)
    .service('FacebookService', FacebookService)
    .directive('cvWhenScroll', WhenScrollDerective.ddo)
    .controller('TopController', TopController)
    .controller('MainController', MainController)
    .controller('MainAllController', MainAllController)
    .controller('MainTagController', MainTagController)
    .controller('MainUserController', MainUserController)
    .controller('MainPostController', MainPostController)
    .controller('MainMyPostsController', MainMyPostsController)
    .controller('DeletePostConfirmModalController', DeletePostConfirmModalController)
    .controller('MainComposeController', MainComposeController)
    .controller('LoginController', LoginController)
    .controller('SignupController', SignupController)
    .controller('NavbarController', NavbarController)
    .controller('TabmenuController', TabmenuController)
    .controller('SettingsMenuController', SettingsMenuController)
    .controller('SettingsContentController', SettingsContentController)
    .controller('SettingsProfileController', SettingsProfileController)
    .controller('SettingsChildrenController', SettingsChildrenController)
    .controller('SettingsChildController', SettingsChildController)
    .controller('SettingsFamilyController', SettingsFamilyController)
    .controller('SettingsFamilyApplicationController', SettingsFamilyApplicationController)
    .controller('SettingsFamilyApprovalController', SettingsFamilyApprovalController)
    .controller('RejectOrApproveConfirmModalController', RejectOrApproveConfirmModalController)

  .config(function ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
    $stateProvider
      .state('top', {
        url: '',
        templateUrl: 'app/top/top.html'
      })
      .state('home', {
        // url: '',
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
      .state('home.post', {
        url: '/post/:voiceId',
        templateUrl: 'app/main/post/main.post.html',
        params: { voice: null }
      })
      .state('home.tag', {
        url: '/tag/:tag',
        templateUrl: 'app/main/tag/main.tag.html'
      })
      .state('home.user', {
        url: '/user/:id',
        templateUrl: 'app/main/user/main.user.html'
      })
      .state('home.compose', {
        url: '/compose/:voiceId',
        templateUrl: 'app/main/compose/main.compose.html',
        params: { voice: null }
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
        url: '/child/:childId',
        templateUrl: 'app/settings/content/child/settings.child.html'
      })
      .state('settings.family', {
        url: '/family',
        templateUrl: 'app/settings/content/family/settings.family.html'
      })
      .state('settings.family_application', {
        url: '/family_application',
        templateUrl: 'app/settings/content/family_application/settings.family_application.html'
      })
      .state('settings.family_approval', {
        url: '/family_approval',
        templateUrl: 'app/settings/content/family_approval/settings.family_approval.html'
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
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider: any) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
  .run(function($rootScope: IChavoRootScope, $window: any, $state: ng.ui.IState) {
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

    $rootScope.$on('$stateChangeSuccess',
        (event: angular.IAngularEvent,
          toState: ng.ui.IState,
          toParams: any,
          fromState: ng.ui.IState,
          fromParams: any) => {

        // all, myposts等の無限スクロールを解除
        if (fromState.name === 'home.all' || fromState.name === 'home.myposts' || fromState.name === 'home.tag') {
          WhenScrollController.unbind();
        }

        // 背景写真セット
        if (toState.name === 'top' || toState.name === 'login' || toState.name === 'signup') {
          angular.element(document).find('body').addClass('fullscreen-background');
          angular.element("#fullscreen-background").addClass('fullscreen-background-div');
        } else {
          angular.element(document).find('body').removeClass('fullscreen-background');
          angular.element("#fullscreen-background").removeClass('fullscreen-background-div');
        }
    });
  });
}
