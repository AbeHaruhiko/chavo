var chavo;
(function (chavo) {
    'use strict';
    var MainMyPostsController = (function () {
        function MainMyPostsController($scope, $rootScope, $state, cfpLoadingBar, $modal) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$modal = $modal;
            this.voices = new Array();
            this.init();
        }
        MainMyPostsController.prototype.init = function () {
            var _this = this;
            var ParseVoice = Parse.Object.extend('Voice');
            var query = new Parse.Query(ParseVoice);
            var parseVoices;
            this.cfpLoadingBar.start();
            query.descending('createdAt');
            query.find({
                success: function (results) {
                    console.log('success.');
                },
                error: function (error) {
                    console.error('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                parseVoices = results;
                var promises = [];
                results.forEach(function (voice) {
                    promises.push(voice.get('user').fetch());
                });
                if (Parse.User.current()) {
                    promises.push(Parse.User.current().fetch());
                }
                return Parse.Promise.when(promises);
            })
                .then(function () {
                _this.applyFoundVoices(parseVoices);
            }, function (error) {
                console.error(error);
                _this.applyFoundVoices(parseVoices);
            });
        };
        MainMyPostsController.prototype.toggleLike = function (voice) {
            var _this = this;
            voice.like = !voice.like;
            Parse.Cloud.run('toggleLike', { voice: voice })
                .then(function (likeCount) {
                _this.$scope.$apply(function () {
                    voice.likeCount = likeCount;
                });
            }, function (error) {
                console.error('Error: ' + error.code + ' ' + error.message);
            });
        };
        MainMyPostsController.prototype.openDeletePostConfirmModal = function (voice) {
            var _this = this;
            var modalInstance = this.$modal.open({
                animation: true,
                templateUrl: 'deletePostConfirmModal.html',
                controller: 'DeletePostConfirmModalController',
                controllerAs: 'delete_post_modal',
                size: 'sm',
                resolve: {
                    voice: function () {
                        return voice;
                    }
                }
            });
            modalInstance.result.then(function (voice) {
                var ParseVoice = Parse.Object.extend('Voice');
                var parseVoice = new ParseVoice();
                parseVoice.id = voice.objectId;
                parseVoice.destroy()
                    .then(function () {
                    _this.$state.reload();
                });
                console.dir(voice);
            }, function () {
                console.dir(voice);
            });
        };
        MainMyPostsController.prototype.applyFoundVoices = function (parseVoices) {
            var _this = this;
            var myLikes = !this.$rootScope.currentUser ? []
                : !this.$rootScope.currentUser.get('likes') ? []
                    : this.$rootScope.currentUser.get('likes');
            parseVoices.forEach(function (voice) {
                if (voice.get('user').get('username') !== undefined) {
                    _this.voices.push(new chavo.Voice(voice, myLikes));
                }
            });
            this.cfpLoadingBar.complete();
            this.$scope.$apply();
        };
        return MainMyPostsController;
    })();
    chavo.MainMyPostsController = MainMyPostsController;
    var DeletePostConfirmModalController = (function () {
        function DeletePostConfirmModalController($scope, $modalInstance, voice) {
            this.$scope = $scope;
            this.$modalInstance = $modalInstance;
            this.voice = voice;
        }
        DeletePostConfirmModalController.prototype.ok = function () {
            this.$modalInstance.close(this.voice);
        };
        DeletePostConfirmModalController.prototype.cancel = function () {
            this.$modalInstance.dismiss('cancel');
        };
        return DeletePostConfirmModalController;
    })();
    chavo.DeletePostConfirmModalController = DeletePostConfirmModalController;
})(chavo || (chavo = {}));
