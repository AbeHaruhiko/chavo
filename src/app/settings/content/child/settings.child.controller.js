var chavo;
(function (chavo) {
    'use strict';
    var Child = (function () {
        function Child(dispOrder, nickName, birthday, gender, age) {
            if (gender === void 0) { gender = GENDER.OTHER; }
            this.dispOrder = dispOrder;
            this.nickName = nickName;
            this.birthday = birthday;
            this.gender = gender;
            this.age = age;
        }
        return Child;
    })();
    chavo.Child = Child;
    (function (GENDER) {
        GENDER[GENDER["MALE"] = 0] = "MALE";
        GENDER[GENDER["FEMALE"] = 1] = "FEMALE";
        GENDER[GENDER["OTHER"] = 2] = "OTHER";
    })(chavo.GENDER || (chavo.GENDER = {}));
    var GENDER = chavo.GENDER;
    var SettingsChildController = (function () {
        function SettingsChildController($scope, $rootScope, $state, $stateParams) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            console.log(this.$rootScope.targetChild);
            var momentObj = (this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
            this.yearSelected = momentObj.format('YYYY');
            this.monthSelected = momentObj.format('MM');
            this.dateSelected = momentObj.format('DD');
            this.birthYears = new Array();
            for (var i = 1900; i <= moment().year(); i++) {
                this.birthYears.push(i);
            }
            this.birthMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            this.birthDates = new Array();
            for (i = 1; i <= 31; i++) {
                this.birthDates.push(i);
            }
            this.dropDownStatus = {
                yearIsOpen: false,
                monthIsOpen: false,
                dateIsOpen: false
            };
        }
        SettingsChildController.prototype.saveChildData = function () {
            var _this = this;
            var dispOrder = 0;
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.descending('dispOrder');
            query.first({
                success: function (result) {
                    if (result && result.get('dispOrder')) {
                        dispOrder = result.get('dispOrder');
                    }
                },
                error: function (error) {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function () {
                var child = new ParseChild();
                child.set('dispOrder', dispOrder + 1);
                child.set('nickName', _this.$rootScope.targetChild.nickName);
                child.set('gender', _this.$rootScope.targetChild.gender);
                return child.save({
                    error: function (error) {
                        console.log('Error: ' + error.code + ' ' + error.message);
                    }
                });
            }).then(function () {
                console.log('ほぞんしました');
            });
        };
        return SettingsChildController;
    })();
    chavo.SettingsChildController = SettingsChildController;
})(chavo || (chavo = {}));
