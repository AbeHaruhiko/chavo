var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.showIcon = false;
            this.profile = new chavo.Profile($rootScope.currentUser.getUsername(), $rootScope.currentUser.getEmail(), null, $rootScope.currentUser.get('iconUrl'), $rootScope.currentUser.get('likes'));
            var fileSelector = angular.element('#photo-selector');
            fileSelector.fileinput({
                'uploadUrl': 'dummy',
                'dropZoneEnabled': false,
                'showCaption': false,
                'showPreview': true,
                'browseClass': 'photo-browse-btn btn btn-primary btn-outline',
                'browseLabel': '画像選択'
            });
            fileSelector.on('filepreupload', function (event, data, previewId, index) {
                if (data.files.length > 0) {
                    var file = data.files[0];
                    var name = 'photo.jpg';
                    var parseFile = new Parse.File(name, file);
                    parseFile.save().then(function () {
                        _this.$rootScope.currentUser.set('icon', parseFile);
                        _this.$rootScope.currentUser.set('iconUrl', parseFile.url());
                        return _this.$rootScope.currentUser.save();
                    }).then(function () {
                        var profilePhoto = _this.$rootScope.currentUser.get('icon');
                        $scope.$apply(function () {
                            _this.profile.icon = profilePhoto.url();
                            _this.showIcon = true;
                        });
                        fileSelector.fileinput('clear');
                    }, function (error) {
                        console.error(error);
                    });
                }
            });
            fileSelector.on('fileuploaderror', function (event, data, previewId, index) {
                angular.element('.file-error-message').css('display', 'none');
                console.error('file upload error. (this is expected results. please ignore.)');
            });
        }
        SettingsProfileController.prototype.saveProfile = function () {
            var profInput = {
                username: this.profile.username,
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
