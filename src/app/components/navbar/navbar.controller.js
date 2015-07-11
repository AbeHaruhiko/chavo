var chavo;
(function (chavo) {
    'use strict';
    var NavbarController = (function () {
        function NavbarController($scope, $rootScope, AuthService, $state, $location) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
            this.$state = $state;
            this.$location = $location;
        }
        NavbarController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$location.path('/login');
                }
            });
        };
        NavbarController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        NavbarController.prototype.loginWithFacebook = function () {
            var _this = this;
            this.AuthService.loginWithFacebook({
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    FB.api('/me', 'GET', function (response) {
                        console.log('Successful login for: ' + response.name);
                        user.setUsername(response.name);
                        _this.$state.go('home');
                    });
                },
                error: function (user, error) {
                    alert('User cancelled the Facebook login or did not fully authorize.');
                }
            });
        };
        return NavbarController;
    })();
    chavo.NavbarController = NavbarController;
})(chavo || (chavo = {}));
