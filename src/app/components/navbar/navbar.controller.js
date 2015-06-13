var chavo;
(function (chavo) {
    'use strict';
    var NavbarController = (function () {
        function NavbarController($scope, $rootScope, AuthService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
        }
        NavbarController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        return NavbarController;
    })();
    chavo.NavbarController = NavbarController;
})(chavo || (chavo = {}));
