var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope, cfpLoadingBar) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.cfpLoadingBar = cfpLoadingBar;
            this.showIcon = false;
            this.disableInput = false;
            this.profile = new chavo.Profile($rootScope.currentUser.getUsername(), $rootScope.currentUser.getEmail(), null, $rootScope.currentUser.get('iconUrl'), $rootScope.currentUser.get('likes'));
            var fileSelector = angular.element('#photo-selector');
            fileSelector.fileinput({
                dropZoneEnabled: false,
                showCaption: false,
                showUpload: false,
                showPreview: true,
                browseClass: 'photo-browse-btn btn btn-primary btn-outline',
                browseLabel: '画像選択'
            });
        }
        SettingsProfileController.prototype.saveProfile = function () {
            var _this = this;
            this.disableInput = true;
            this.cfpLoadingBar.start();
            var profInput = {
                username: this.profile.username,
                email: this.profile.email
            };
            if (this.profile.password) {
                profInput.password = this.profile.password;
            }
            var fileSelector = angular.element('#photo-selector');
            if (fileSelector[0].files.length > 0) {
                var file = fileSelector[0].files[0];
                var name = 'photo.jpg';
                var parseFile = new Parse.File(name, file);
                parseFile.save().then(function () {
                    _this.$rootScope.currentUser.set('icon', parseFile);
                    _this.$rootScope.currentUser.set('iconUrl', parseFile.url());
                    return _this.$rootScope.currentUser.save(profInput);
                }).then(function () {
                    var profilePhoto = _this.$rootScope.currentUser.get('icon');
                    _this.$scope.$apply(function () {
                        fileSelector.fileinput('clear');
                        _this.profile.icon = profilePhoto.url();
                        _this.showIcon = true;
                    });
                    _this.cfpLoadingBar.complete();
                    _this.disableInput = false;
                }, function (error) {
                    console.error(error);
                    this.cfpLoadingBar.complete();
                    this.disableInput = false;
                });
            }
            else {
                this.$rootScope.currentUser.save(profInput)
                    .then(function (user) {
                    console.log('ほぞんしました');
                    _this.cfpLoadingBar.complete();
                    _this.disableInput = false;
                }, function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                    _this.cfpLoadingBar.complete();
                    _this.disableInput = false;
                });
            }
        };
        return SettingsProfileController;
    })();
    chavo.SettingsProfileController = SettingsProfileController;
})(chavo || (chavo = {}));
