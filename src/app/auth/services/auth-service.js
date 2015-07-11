var chavo;
(function (chavo) {
    'use strict';
    var AuthService = (function () {
        function AuthService($state, $rootScope) {
            this.$state = $state;
            this.$rootScope = $rootScope;
        }
        AuthService.prototype.signUp = function (form, callbacks) {
            var user = new Parse.User();
            user.set('email', form.username);
            user.set('username', form.username);
            user.set('password', form.password);
            user.signUp(null, callbacks);
        };
        AuthService.prototype.loginWithFacebook = function (callbacks) {
            Parse.FacebookUtils.logIn(null, callbacks);
        };
        AuthService.prototype.logIn = function (authData, callbacks) {
            var _this = this;
            Parse.User.logIn(authData.username, authData.password, callbacks)
                .then(function (user) {
                _this.$rootScope.currentUser = user;
            });
        };
        AuthService.prototype.logOut = function () {
            var _this = this;
            Parse.User.logOut()
                .then(function () {
                _this.$rootScope.currentUser = null;
            });
        };
        return AuthService;
    })();
    chavo.AuthService = AuthService;
})(chavo || (chavo = {}));
