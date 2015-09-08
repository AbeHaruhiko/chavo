var chavo;
(function (chavo) {
    'use strict';
    var SettingsMenuController = (function () {
        function SettingsMenuController($scope, $rootScope, $state) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.menus = [
                { title: 'プロフィール', route: 'settings.profile' },
                { title: 'こどもの情報', route: 'settings.children' },
            ];
        }
        return SettingsMenuController;
    })();
    chavo.SettingsMenuController = SettingsMenuController;
})(chavo || (chavo = {}));
