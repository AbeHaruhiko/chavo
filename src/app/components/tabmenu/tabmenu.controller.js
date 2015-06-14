var chavo;
(function (chavo) {
    'use strict';
    var TabmenuController = (function () {
        function TabmenuController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.tabs = [
                { title: 'Dynamic Title 1', content: 'Dynamic content 1' },
                { title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true }
            ];
        }
        return TabmenuController;
    })();
    chavo.TabmenuController = TabmenuController;
})(chavo || (chavo = {}));
