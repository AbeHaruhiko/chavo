var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildController = (function () {
        function SettingsChildController($scope, $rootScope, $state, $stateParams) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            console.log(this.$rootScope.targetChild);
            var momentObj = (this.$rootScope.targetChild && this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
            this.yearSelected = momentObj.year();
            this.monthSelected = momentObj.month();
            this.dateSelected = momentObj.date();
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
            if (this.$rootScope.targetChild.dispOrder > 0) {
                var ParseChild = Parse.Object.extend('Child');
                var query = new Parse.Query(ParseChild);
                query.equalTo('dispOrder', this.$rootScope.targetChild.dispOrder);
                query.first().then(function (child) {
                    child.set('dispOrder', _this.$rootScope.targetChild.dispOrder);
                    child.set('nickName', _this.$rootScope.targetChild ? _this.$rootScope.targetChild.nickName : null);
                    child.set('birthday', _this.getInputBirthday());
                    child.set('gender', +_this.$rootScope.targetChild.gender);
                    return child.save({
                        error: function (child, error) {
                            console.log('Error: ' + error.code + ' ' + error.message);
                        }
                    });
                }).then(function () {
                    console.log('ほぞんしました');
                });
            }
            else {
                var dispOrder = 0;
                ParseChild = Parse.Object.extend('Child');
                query = new Parse.Query(ParseChild);
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
                    child.set('nickName', _this.$rootScope.targetChild ? _this.$rootScope.targetChild.nickName : null);
                    child.set('birthday', _this.getInputBirthday());
                    child.set('gender', +_this.$rootScope.targetChild.gender);
                    return child.save({
                        error: function (child, error) {
                            console.log('Error: ' + error.code + ' ' + error.message);
                        }
                    });
                }).then(function () {
                    console.log('ほぞんしました');
                });
            }
        };
        SettingsChildController.prototype.getInputBirthday = function () {
            if (this.$rootScope.targetChild.unableBirthday) {
                return null;
            }
            return moment({ year: this.yearSelected,
                months: this.monthSelected,
                date: this.dateSelected })
                .toDate();
        };
        return SettingsChildController;
    })();
    chavo.SettingsChildController = SettingsChildController;
})(chavo || (chavo = {}));
