var chavo;
(function (chavo) {
    'use strict';
    var TabmenuController = (function () {
        function TabmenuController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.tabs = [
                { heading: 'みんなの', route: 'home.all' },
                { heading: 'あなたの', route: 'home.myposts', disabled: false },
                { heading: 'タグ', route: 'home.tag', disabled: false },
                { heading: '<i class="fa fa-pencil"></i>', route: 'home.compose', disabled: false }
            ];
        }
        return TabmenuController;
    })();
    chavo.TabmenuController = TabmenuController;
})(chavo || (chavo = {}));
