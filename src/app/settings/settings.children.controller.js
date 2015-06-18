var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.children = [
                { nickName: 'もも' },
                { nickName: 'あお' },
            ];
        }
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
