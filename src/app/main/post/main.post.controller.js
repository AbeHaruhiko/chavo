var chavo;
(function (chavo) {
    'use strict';
    var MainPostController = (function () {
        function MainPostController($scope, $rootScope, $state, $stateParams, cfpLoadingBar, $modal) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$modal = $modal;
            this.init();
        }
        MainPostController.prototype.init = function () {
            if (this.$stateParams['voice']) {
                this.voice = this.$stateParams['voice'];
            }
            else {
            }
        };
        MainPostController.prototype.toggleLike = function (voice) {
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
        MainPostController.prototype.openDeletePostConfirmModal = function (voice) {
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
        MainPostController.prototype.applyFoundVoices = function (parseVoices) {
            var _this = this;
            var myLikes = !this.$rootScope.currentUser ? []
                : !this.$rootScope.currentUser.get('likes') ? []
                    : this.$rootScope.currentUser.get('likes');
            parseVoices.forEach(function (voice) {
                if (voice.get('user').get('username') !== undefined) {
                    _this.voice = new chavo.Voice(voice, myLikes);
                }
            });
            this.cfpLoadingBar.complete();
            this.$scope.$apply();
        };
        return MainPostController;
    })();
    chavo.MainPostController = MainPostController;
})(chavo || (chavo = {}));
