var chavo;
(function (chavo) {
    'use strict';
    var SignupController = (function () {
        function SignupController($scope, $rootScope, $state, $location, AuthService, $q, FacebookService) {
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
        SignupController.prototype.signUp = function (form) {
            var _this = this;
            this.AuthService.signUp(form, {
                success: function (user) {
                    _this.$state.reload();
                },
                error: function (user, error) {
                    alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                }
            });
        };
        return SignupController;
    })();
    chavo.SignupController = SignupController;
})(chavo || (chavo = {}));
