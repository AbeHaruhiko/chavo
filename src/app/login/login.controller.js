var chavo;
(function (chavo) {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $rootScope, $state, $location, AuthService, $q, FacebookService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$location = $location;
            this.AuthService = AuthService;
            this.$q = $q;
            this.FacebookService = FacebookService;
        }
        LoginController.prototype.signUp = function (form) {
            var _this = this;
            this.AuthService.signUp(form, {
                success: function (user) {
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                }
            });
        };
        LoginController.prototype.loginWithFacebook = function () {
            var _this = this;
            this.AuthService.loginWithFacebook({
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    _this.$q.all([
                        _this.FacebookService.api('/me'),
                        _this.FacebookService.api('/' + user.get('authData').facebook.id + '/picture')
                    ])
                        .then(function (response) {
                        _this.$rootScope.currentUser.setUsername(response[0].name);
                        _this.$rootScope.currentUser.set('iconUrl', response[1].data.url);
                        _this.$rootScope.currentUser.save({
                            error: function (user, error) {
                                console.error(error.code + ":" + error.message);
                            }
                        }, null, null)
                            .then(function () {
                            _this.$state.go('home');
                        });
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
