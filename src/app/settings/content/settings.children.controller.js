var chavo;
(function (chavo) {
    'use strict';
    var Child = (function () {
        function Child(nickName, birthday, sex, age) {
            this.nickName = nickName;
            this.birthday = birthday;
            this.sex = sex;
            this.age = age;
        }
        return Child;
    })();
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope) {
            // this.children = [
            //   { nickName: 'もも', birthDay: '2012/11/26', sex: 2},
            //   { nickName: 'あお'},
            // ];
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.children = new Array();
            this.children.push(new Child('もも', moment('2012/11/26', 'YYYY/MM/DD').toDate(), 2));
            this.children.push(new Child('あお', null, null));
            this.children.forEach(function (child) {
                var years = moment().diff(moment(child.birthday), 'years');
                var months = moment().diff(moment(child.birthday), 'months') - (12 * years);
                child.age = (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '');
            });
        }
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
