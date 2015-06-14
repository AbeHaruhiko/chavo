var chavo;
(function (chavo) {
    'use strict';
    var TabmenuController = (function () {
        function TabmenuController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.tabs = [
                { heading: 'Dynamic Title 1', route: 'home.all' },
                { heading: 'Dynamic Title 2', route: 'home.myposts', disabled: true }
            ];
        }
        return TabmenuController;
    })();
    chavo.TabmenuController = TabmenuController;
})(chavo || (chavo = {}));
