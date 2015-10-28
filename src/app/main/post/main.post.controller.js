var chavo;
(function (chavo) {
    'use strict';
    var MainPostController = (function () {
        function MainPostController($scope, $rootScope, $state, $stateParams, $attrs, cfpLoadingBar, $modal) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$attrs = $attrs;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$modal = $modal;
            this.init();
        }
        MainPostController.prototype.init = function () {
            var _this = this;
            if (this.$stateParams['voice']) {
                this.voice = this.$stateParams['voice'];
            }
            else {
                var ParseVoice = Parse.Object.extend('Voice');
                var query = new Parse.Query(ParseVoice);
                var parseVoice;
                this.cfpLoadingBar.start();
                query.descending('createdAt');
                query.include('user');
                query.equalTo('objectId', this.$stateParams['voiceId'] || this.$attrs['voice']);
                query.first()
                    .then(function (result) {
                    parseVoice = result;
                    if (Parse.User.current()) {
                        return Parse.User.current().fetch();
                    }
                    else {
                        return Parse.Promise.as('');
                    }
                })
                    .then(function () {
                    _this.applyFoundVoices(parseVoice);
                }, function (error) {
                    console.error(error);
                    _this.applyFoundVoices(parseVoice);
                });
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
        MainPostController.prototype.applyFoundVoices = function (parseVoice) {
            var myLikes = !this.$rootScope.currentUser ? []
                : !this.$rootScope.currentUser.get('likes') ? []
                    : this.$rootScope.currentUser.get('likes');
            if (parseVoice.get('user').get('username') !== undefined) {
                this.voice = new chavo.Voice(parseVoice, myLikes);
            }
            this.cfpLoadingBar.complete();
            this.$scope.$apply();
        };
        return MainPostController;
    })();
    chavo.MainPostController = MainPostController;
})(chavo || (chavo = {}));
