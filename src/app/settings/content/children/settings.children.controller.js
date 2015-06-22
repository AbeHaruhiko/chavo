var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope, $state) {
            // this.children = [
            //   { nickName: 'もも', birthDay: '2012/11/26', sex: 2},
            //   { nickName: 'あお'},
            // ];
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.children = new Array();
            this.children.push(new chavo.Child(1, 'もも', moment('2012/11/26', 'YYYY/MM/DD').toDate(), chavo.GENDER.FEMALE));
            this.children.push(new chavo.Child(2, 'あお'));
            this.children.forEach(function (child) {
                var years = moment().diff(moment(child.birthday), 'years');
                var months = moment().diff(moment(child.birthday), 'months') - (12 * years);
                child.age = (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '');
            });
        }
        SettingsChildrenController.prototype.go = function (child) {
            this.$rootScope.targetChild = child;
            this.$state.go('settings.child', { childId: child.id });
        };
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
