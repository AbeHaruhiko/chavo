var chavo;
(function (chavo) {
    'use strict';
    var NavbarController = (function () {
        function NavbarController($scope, $rootScope, AuthService, $state, $location, $q, FacebookService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
            this.$state = $state;
            this.$location = $location;
            this.$q = $q;
            this.FacebookService = FacebookService;
            this.notificationCount = 0;
            this.updateNotification();
        }
        NavbarController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.updateNotification();
                    _this.$state.go('home.all');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$state.go('login');
                }
            });
        };
        NavbarController.prototype.logOut = function () {
            this.updateNotification();
            this.AuthService.logOut();
        };
        NavbarController.prototype.loginWithFacebook = function () {
            this.updateNotification();
            this.FacebookService.loginWithFacebookAndGoHome();
        };
        NavbarController.prototype.fetchUser = function () {
            var _this = this;
            Parse.User.current().fetch()
                .then(function (user) {
                _this.$rootScope.$apply(function () {
                    _this.$rootScope.currentUser = Parse.User.current();
                });
            }, function (error) {
                console.error('Error: ' + error.code + ' ' + error.message);
            });
        };
        NavbarController.prototype.updateNotification = function () {
            var _this = this;
            Parse.Cloud.run('getCountOfFamilyAppToRequestUser')
                .then(function (count) {
                _this.$scope.$apply(function () {
                    _this.notificationCount = count;
                });
            });
        };
        return NavbarController;
    })();
    chavo.NavbarController = NavbarController;
})(chavo || (chavo = {}));
