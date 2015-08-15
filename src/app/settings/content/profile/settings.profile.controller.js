var chavo;
(function (chavo) {
    'use strict';
    var SettingsProfileController = (function () {
        function SettingsProfileController($scope, $rootScope) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.profile = new chavo.Profile($rootScope.currentUser.getUsername(), $rootScope.currentUser.getEmail(), null, null);
            var fileSelector = angular.element("#photo-selector");
            fileSelector.fileinput({ "uploadUrl": "dummy", "dropZoneEnabled": false });
            fileSelector.on("filepreupload", function (event, data, previewId, index) {
                if (data.files.length > 0) {
                    var file = data.files[0];
                    var name = "photo.jpg";
                    var parseFile = new Parse.File(name, file);
                    parseFile.save().then(function () {
                        var _this = this;
                        this.$rootScopes.currentMember.set("icon", parseFile);
                        this.$rootScopes.currentMember.save().then(function () {
                            var profilePhoto = _this.$rootScopes.currentMember.get("icon");
                            $scope.$apply(function () {
                                this.profile.icon = profilePhoto.url();
                            });
                            fileSelector.fileinput("clear");
                        }, function (error) {
                        });
                    }, function (error) {
                        console.log(error);
                    });
                }
            });
            fileSelector.on('fileuploaderror', function (event, data, previewId, index) {
                console.error('file upload error. (this is expected results.)');
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
