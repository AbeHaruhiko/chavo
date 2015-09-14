var chavo;
(function (chavo) {
    'use strict';
    var MainAllController = (function () {
        function MainAllController($scope, $rootScope, cfpLoadingBar) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.cfpLoadingBar = cfpLoadingBar;
            this.voices = new Array();
            var ParseVoice = Parse.Object.extend('Voice');
            var query = new Parse.Query(ParseVoice);
            var parseVoices;
            cfpLoadingBar.start();
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
                promises.push(Parse.User.current().fetch());
                return Parse.Promise.when(promises);
            })
                .then(function () {
                parseVoices.forEach(function (voice) {
                    var myLikes = !$rootScope.currentUser ? []
                        : !$rootScope.currentUser.get('likes') ? []
                            : $rootScope.currentUser.get('likes');
                    console.log('myLikes: ' + myLikes);
                    _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').id, voice.get('user').get('iconUrl') === undefined ?
                        voice.get('icon') === undefined ? null : voice.get('icon').url()
                        : voice.get('user').get('iconUrl'), myLikes.indexOf(voice.id) >= 0 ? true : false, voice.get('likeCount'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            }, function (error) {
                console.error(error);
                var myLikes = !$rootScope.currentUser ? []
                    : !$rootScope.currentUser.get('likes') ? []
                        : $rootScope.currentUser.get('likes');
                console.log('myLikes: ' + myLikes);
                parseVoices.forEach(function (voice) {
                    if (voice.get('user').get('username') !== undefined) {
                        _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').id, voice.get('user').get('iconUrl') === undefined ?
                            voice.get('icon') === undefined ? null : voice.get('icon').url()
                            : voice.get('user').get('iconUrl'), myLikes.indexOf(voice.id) >= 0 ? true : false, voice.get('likeCount'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                    }
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            });
        }
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
        return MainAllController;
    })();
    chavo.MainAllController = MainAllController;
})(chavo || (chavo = {}));
