var chavo;
(function (chavo) {
    'use strict';
    var SettingsFamilyApprovalController = (function () {
        function SettingsFamilyApprovalController($scope, $rootScope, $state, $stateParams, cfpLoadingBar, $q) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$q = $q;
        }
        return SettingsFamilyApprovalController;
    })();
    chavo.SettingsFamilyApprovalController = SettingsFamilyApprovalController;
})(chavo || (chavo = {}));
