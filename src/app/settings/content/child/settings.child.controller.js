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
            this.$scope.minDate = $scope.minDate ? null : new Date();
            this.$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            this.$scope.format = $scope.formats[0];
            this.$scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            this.$scope.dt = new Date();
        }
        SettingsChildController.prototype.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.$scope.datePickerOpen = !this.$scope.datePickerOpen;
        };
        return SettingsChildController;
    })();
    chavo.SettingsChildController = SettingsChildController;
})(chavo || (chavo = {}));
