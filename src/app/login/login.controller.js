var chavo;
(function (chavo) {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope) {
            this.$scope = $scope;
        }
        LoginController.prototype.logOut = function () {
            Parse.User.logOut();
        };
        return LoginController;
    })();
    chavo.LoginController = LoginController;
})(chavo || (chavo = {}));
