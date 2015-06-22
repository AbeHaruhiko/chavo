var chavo;
(function (chavo) {
    'use strict';
    var Child = (function () {
        function Child(id, nickName, birthday, sex, age) {
            this.id = id;
            this.nickName = nickName;
            this.birthday = birthday;
            this.sex = sex;
            this.age = age;
        }
        return Child;
    })();
    chavo.Child = Child;
    var SettingsChildController = (function () {
        function SettingsChildController($scope, $rootScope, $state, $stateParams) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            console.log(this.$rootScope.targetChild);
            var momentObj = (this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
            this.yearSelected = momentObj.format('YYYY');
            this.monthOfToday = momentObj.format('MM');
            this.dateOfToday = momentObj.format('DD');
            this.birthYears = new Array();
            for (var i = 1900; i < moment().year(); i++) {
                this.birthYears.push(i);
            }
            this.dropDownStatus = {
                yearIsOpen: false,
                monthIsOpen: false
            };
        }
        return SettingsChildController;
    })();
    chavo.SettingsChildController = SettingsChildController;
})(chavo || (chavo = {}));
