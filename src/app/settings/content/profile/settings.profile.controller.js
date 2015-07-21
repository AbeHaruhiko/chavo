var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
        }
        SettingsProfileController.prototype.saveProfile = function () {
            this.$rootScope.currentUser.save()
                .then(function (user) {
                console.log('ほぞんしました');
            }, function (error) {
                console.log('Error: ' + error.code + ' ' + error.message);
            });
        };
        return SettingsProfileController;
    })();
    chavo.SettingsProfileController = SettingsProfileController;
})(chavo || (chavo = {}));
