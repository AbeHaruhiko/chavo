var chavo;
(function (chavo) {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $rootScope, $state, $location, AuthService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$location = $location;
            this.AuthService = AuthService;
        }
        LoginController.prototype.signUp = function (form) {
            var _this = this;
            this.AuthService.signUp(form, {
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                }
            });
        };
        LoginController.prototype.signUpWithFacebook = function () {
            var _this = this;
            Parse.FacebookUtils.logIn('public_profile, email', {
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
        LoginController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$location.path('/login');
                }
            });
        };
        LoginController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        return LoginController;
    })();
    chavo.LoginController = LoginController;
})(chavo || (chavo = {}));
