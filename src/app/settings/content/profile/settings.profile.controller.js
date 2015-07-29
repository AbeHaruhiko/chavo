var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.profile = new chavo.Profile($rootScope.currentUser.get('nickname'), $rootScope.currentUser.getEmail(), null);
        }
        SettingsProfileController.prototype.saveProfile = function () {
            var profInput = {
                nickname: this.profile.nickname,
                username: this.profile.email,
                email: this.profile.email
            };
            if (this.profile.password) {
                profInput.password = this.profile.password;
            }
            this.$rootScope.currentUser.save(profInput)
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
