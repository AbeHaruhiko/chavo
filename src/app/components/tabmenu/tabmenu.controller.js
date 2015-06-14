var chavo;
(function (chavo) {
    'use strict';
    var TabmenuController = (function () {
        function TabmenuController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.tabs = [
                { heading: 'すべて', route: 'home.all' },
                { heading: 'あなた', route: 'home.myposts', disabled: false }
            ];
        }
        return TabmenuController;
    })();
    chavo.TabmenuController = TabmenuController;
})(chavo || (chavo = {}));
