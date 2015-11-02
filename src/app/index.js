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
        .directive('cvWhenScroll', chavo.WhenScrollDerective.ddo)
        .controller('TopController', chavo.TopController)
        .controller('MainController', chavo.MainController)
        .controller('MainAllController', chavo.MainAllController)
        .controller('MainTagController', chavo.MainTagController)
        .controller('MainUserController', chavo.MainUserController)
        .controller('MainPostController', chavo.MainPostController)
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
        .controller('SettingsFamilyController', chavo.SettingsFamilyController)
        .controller('SettingsFamilyApplicationController', chavo.SettingsFamilyApplicationController)
        .controller('SettingsFamilyApprovalController', chavo.SettingsFamilyApprovalController)
        .controller('RejectOrApproveConfirmModalController', chavo.RejectOrApproveConfirmModalController)
        .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('top', {
            url: '',
            templateUrl: 'app/top/top.html'
        })
            .state('home', {
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
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .run(function ($rootScope, $window, $state) {
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
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (fromState.name === 'home.all' || fromState.name === 'home.myposts' || fromState.name === 'home.tag') {
                chavo.WhenScrollController.unbind();
            }
            if (toState.name === 'top' || toState.name === 'login' || toState.name === 'signup') {
                angular.element(document).find('body').addClass('fullscreen-background');
                angular.element("#fullscreen-background").addClass('fullscreen-background-div');
            }
            else {
                angular.element(document).find('body').removeClass('fullscreen-background');
                angular.element("#fullscreen-background").removeClass('fullscreen-background-div');
            }
        });
    });
})(chavo || (chavo = {}));
