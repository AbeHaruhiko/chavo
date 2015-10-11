var chavo;
(function (chavo) {
    'use strict';
    var SettingsFamilyController = (function () {
        function SettingsFamilyController($scope, $rootScope, $state, cfpLoadingBar) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.cfpLoadingBar = cfpLoadingBar;
            this.familyMembers = new Array();
            this.familyApps = new Array();
            cfpLoadingBar.start();
            Parse.Cloud.run('getRequestUsersFamilyMember')
                .then(function (parseFamilyList) {
                parseFamilyList.forEach(function (family) {
                    _this.familyMembers.push(new chavo.Profile(family.get('username'), null, null, family.get('iconUrl'), null));
                });
                cfpLoadingBar.complete();
            });
            Parse.Cloud.run('getFamilyAppFromRequestUser')
                .then(function (parseFamilyAppList) {
                console.dir(parseFamilyAppList);
                parseFamilyAppList.forEach(function (parseFamilyApplication) {
                    _this.familyApps.push(new chavo.FamilyApplication(parseFamilyApplication.get(Parse.User.current().get('usename')), parseFamilyApplication.get(Parse.User.current().id), parseFamilyApplication.get(Parse.User.current().get('iconUrl')), parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).get('username'), parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).id, parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).get('iconUrl'), parseFamilyApplication.get(Const.FamilyApplication.COL_APPLY_DATE_TIME), parseFamilyApplication.id));
                });
                console.dir(_this.familyApps);
            });
        }
        SettingsFamilyController.prototype.go = function (child) {
            child = child ? child : new chavo.Child();
            this.$rootScope.targetChild = child;
            this.$state.go('settings.family.apply', { childId: child.dispOrder });
        };
        return SettingsFamilyController;
    })();
    chavo.SettingsFamilyController = SettingsFamilyController;
})(chavo || (chavo = {}));
