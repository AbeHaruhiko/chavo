var chavo;
(function (chavo) {
    'use strict';
    var SettingsContentController = (function () {
        function SettingsContentController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
        }
        return SettingsContentController;
    })();
    chavo.SettingsContentController = SettingsContentController;
})(chavo || (chavo = {}));
