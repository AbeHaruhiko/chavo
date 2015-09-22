var chavo;
(function (chavo) {
    'use strict';
    var MainAllController = (function () {
        function MainAllController($scope, $rootScope, $state, cfpLoadingBar, $modal) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$modal = $modal;
            this.voices = new Array();
            this.init();
        }
        MainAllController.prototype.init = function () {
            var _this = this;
            var ParseVoice = Parse.Object.extend('Voice');
            var query = new Parse.Query(ParseVoice);
            var parseVoices;
            this.cfpLoadingBar.start();
            query.descending('createdAt');
            query.find({
                success: function (results) {
                },
                error: function (error) {
                    console.error('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                // 投稿者のアイコンを取得するため、fetchする。
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
                parseVoices.forEach(function (voice) {
                    var myLikes = !_this.$rootScope.currentUser ? []
                        : !_this.$rootScope.currentUser.get('likes') ? []
                            : _this.$rootScope.currentUser.get('likes');
                    console.log('myLikes: ' + myLikes);
                    _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), _this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths')), voice.get('ageYears'), voice.get('ageMonths'), voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('gender'), voice.get('user').get('username'), voice.get('user').id, voice.get('user').get('iconUrl') === undefined ?
                        voice.get('icon') === undefined ? null : voice.get('icon').url()
                        : voice.get('user').get('iconUrl'), myLikes.indexOf(voice.id) >= 0 ? true : false, voice.get('likeCount'), voice.getACL().getPublicReadAccess(), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                });
                _this.cfpLoadingBar.complete();
                _this.$scope.$apply();
            }, function (error) {
                console.error(error);
                var myLikes = !_this.$rootScope.currentUser ? []
                    : !_this.$rootScope.currentUser.get('likes') ? []
                        : _this.$rootScope.currentUser.get('likes');
                console.log('myLikes: ' + myLikes);
                parseVoices.forEach(function (voice) {
                    if (voice.get('user').get('username') !== undefined) {
                        _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), _this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths')), voice.get('ageYears'), voice.get('ageMonths'), voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('gender'), voice.get('user').get('username'), voice.get('user').id, voice.get('user').get('iconUrl') === undefined ?
                            voice.get('icon') === undefined ? null : voice.get('icon').url()
                            : voice.get('user').get('iconUrl'), myLikes.indexOf(voice.id) >= 0 ? true : false, voice.get('likeCount'), voice.getACL().getPublicReadAccess(), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                    }
                });
                _this.cfpLoadingBar.complete();
                _this.$scope.$apply();
            });
        };
        MainAllController.prototype.toggleLike = function (voice) {
            // cloud Codeへ移動
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
        MainAllController.prototype.openDeletePostConfirmModal = function (voice) {
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
                console.info('1: Modal dismissed at: ' + new Date());
                console.dir(voice);
            }, function () {
                console.info('2: Modal dismissed at: ' + new Date());
                console.dir(voice);
            });
        };
        MainAllController.prototype.makeAgeString = function (ageYears, ageMonths) {
            if (ageYears && ageMonths) {
                return ageYears + '歳' + ageMonths + 'ヶ月';
            }
            else if (ageYears) {
                return ageYears + '歳';
            }
            else {
                return '0歳' + ageMonths + 'ヶ月';
            }
        };
        return MainAllController;
    })();
    chavo.MainAllController = MainAllController;
})(chavo || (chavo = {}));
