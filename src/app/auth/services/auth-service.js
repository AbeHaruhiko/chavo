var chavo;
(function (chavo) {
    'use strict';
    var AuthService = (function () {
        function AuthService($state) {
            this.$state = $state;
        }
        AuthService.prototype.signUp = function (form, callbacks) {
            var user = new Parse.User();
            user.set('email', form.username);
            user.set('username', form.username);
            user.set('password', form.password);
            user.signUp(null, callbacks);
        };
        AuthService.prototype.logIn = function (form, callbacks) {
            Parse.User.logIn(form.username, form.password, callbacks);
        };
        AuthService.prototype.logOut = function () {
            Parse.User.logOut();
            this.$state.go('home');
        };
        return AuthService;
    })();
    chavo.AuthService = AuthService;
})(chavo || (chavo = {}));
