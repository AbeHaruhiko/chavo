var chavo;
(function (chavo) {
    'use strict';
    var SettingsFamilyApplicationController = (function () {
        function SettingsFamilyApplicationController($scope, $rootScope, $state, $stateParams, cfpLoadingBar, $q) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$q = $q;
            this.ngTags = [];
            console.log(this.$rootScope.targetChild);
        }
        SettingsFamilyApplicationController.prototype.apply = function () {
            var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
            var query = new Parse.Query(ParseFamilyApplication);
            query.equalTo(Const.FamilyApplication.COL_FROM_USER, Parse.User.current());
            var toUser = new Parse.User();
            toUser.id = this.ngTags[0].objectId;
            query.equalTo(Const.FamilyApplication.COL_TO_USER, toUser);
            query.first().then(function (application) {
                if (application) {
                }
                else {
                    var familyApplication = new ParseFamilyApplication();
                    familyApplication.set(Const.FamilyApplication.COL_FROM_USER, Parse.User.current());
                    familyApplication.set(Const.FamilyApplication.COL_TO_USER, toUser);
                    familyApplication.save();
                }
            });
        };
        SettingsFamilyApplicationController.prototype.loadUser = function (queryString) {
            var query = new Parse.Query(Parse.User);
            query.select('username', 'iconUrl');
            query.startsWith('username', queryString);
            var users = [];
            var deferred = this.$q.defer();
            query.find().then(function (results) {
                results.forEach(function (result) {
                    users.push({ text: result.get('username'), iconUrl: result.get('iconUrl'), objectId: result.id });
                });
                deferred.resolve(users);
            }, null);
            return deferred.promise;
        };
        return SettingsFamilyApplicationController;
    })();
    chavo.SettingsFamilyApplicationController = SettingsFamilyApplicationController;
})(chavo || (chavo = {}));
