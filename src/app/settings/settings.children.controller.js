var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.children = [
                { nickName: 'もも', birthDay: '2012/11/26', sex: 2 },
                { nickName: 'あお' },
            ];
        }
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
