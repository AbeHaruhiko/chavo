var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope, $state) {
            // this.children = [
            //   { nickName: 'もも', birthDay: '2012/11/26', sex: 2},
            //   { nickName: 'あお'},
            // ];
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.children = new Array();
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.ascending('dispOrder');
            query.find({
                error: function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                results.forEach(function (child) {
                    _this.children.push(new chavo.Child(child.get('dispOrder'), child.get('nickName'), null, child.get('gender')));
                });
            });
            this.children.forEach(function (child) {
                var years = moment().diff(moment(child.birthday), 'years');
                var months = moment().diff(moment(child.birthday), 'months') - (12 * years);
                child.age = (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '');
            });
        }
        SettingsChildrenController.prototype.go = function (child) {
            this.$rootScope.targetChild = child;
            this.$state.go('settings.child', { childId: child.dispOrder });
        };
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
