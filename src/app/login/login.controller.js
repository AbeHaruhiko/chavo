var chavo;
(function (chavo) {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $state, $location, AuthService) {
            this.$scope = $scope;
            this.$state = $state;
            this.$location = $location;
            this.AuthService = AuthService;
        }
        LoginController.prototype.signUp = function (form) {
            var _this = this;
            this.AuthService.signUp(form, {
                success: function (user) {
                    _this.$scope.$apply(function () {
                        _this.$state.go('login');
                    });
                },
                error: function (user, error) {
                    alert("Unable to sign up:  " + error.code + " " + error.message);
                }
            });
        };
        LoginController.prototype.logIn = function (form) {
            var _this = this;
            this.AuthService.logIn(form, {
                success: function (user) {
                    _this.$scope.$apply(function () {
                        if (!user.get('emailVerified')) {
                            _this.$state.go('main');
                            return;
                        }
                        _this.$state.go('main');
                    });
                },
                error: function (user, error) {
                    console.log("Unable to login:  " + error.code + " " + error.message);
                    _this.$location.path('/login');
                }
            });
        };
        ;
        LoginController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        return LoginController;
    })();
    chavo.LoginController = LoginController;
})(chavo || (chavo = {}));
