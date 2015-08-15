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
        }
        NavbarController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$state.go('login');
                }
            });
        };
        NavbarController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        NavbarController.prototype.loginWithFacebook = function () {
            this.FacebookService.loginWithFacebookAndGoHome();
        };
        return NavbarController;
    })();
    chavo.NavbarController = NavbarController;
})(chavo || (chavo = {}));
