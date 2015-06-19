var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
        }
        return SettingsProfileController;
    })();
    chavo.SettingsProfileController = SettingsProfileController;
})(chavo || (chavo = {}));
