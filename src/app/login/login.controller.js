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
            this.showResetPwMessage = false;
            if (Parse.User.current()) {
                $state.go('home.all');
            }
        }
        LoginController.prototype.loginWithFacebook = function () {
            this.FacebookService.loginWithFacebookAndGoHome();
        };
        LoginController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.$state.go('home.all');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$scope.$apply(function () {
                        if (error.code === 101) {
                            _this.loginMessage = 'ユーザー名かパスワードが間違っています。';
                        }
                        else if (error.code === 200) {
                            _this.loginMessage = 'ユーザー名が間違っています。';
                        }
                        else if (error.code === 201) {
                            _this.loginMessage = 'パスワードが間違っています。';
                        }
                        else {
                            _this.loginMessage = 'ログインできませんでした。：' + error.code + ' ' + error.message;
                        }
                    });
                }
            });
        };
        LoginController.prototype.requestPasswordReset = function (formData) {
            var _this = this;
            this.AuthService.requestPasswordReset(formData, {
                success: function () {
                    _this.showResetPwMessage = true;
                    _this.$state.go('login');
                },
                error: function (error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$state.go('login');
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
