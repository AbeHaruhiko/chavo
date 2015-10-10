var chavo;
(function (chavo) {
    'use strict';
    var SettingsFamilyController = (function () {
        function SettingsFamilyController($scope, $rootScope, $state, cfpLoadingBar) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.cfpLoadingBar = cfpLoadingBar;
            this.children = new Array();
        }
        return SettingsFamilyController;
    })();
    chavo.SettingsFamilyController = SettingsFamilyController;
})(chavo || (chavo = {}));
