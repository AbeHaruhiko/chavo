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
                parseVoices = results;
                var promises = [];
                results.forEach(function (voice) {
                    promises.push(voice.get('user').fetch());
                });
                return Parse.Promise.when(promises);
            })
                .then(function () {
                parseVoices.forEach(function (voice) {
                    _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').get('iconUrl') === undefined ?
                        voice.get('icon') === undefined ? null : voice.get('icon').url()
                        : voice.get('user').get('iconUrl'), false, voice.get('likeCount'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            }, function (error) {
                // 投稿ユーザがいない場合などエラーになる
                parseVoices.forEach(function (voice) {
                    if (voice.get('user').get('username') !== undefined) {
                        _this.voices.push(new chavo.Voice(voice.id, voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').get('iconUrl') === undefined ?
                            voice.get('icon') === undefined ? null : voice.get('icon').url()
                            : voice.get('user').get('iconUrl'), false, voice.get('likeCount'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                    }
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            });
        }
        MainAllController.prototype.toggleLike = function (voice) {
            var _this = this;
            voice.like = !voice.like;
            var ParseVoice = Parse.Object.extend('Voice');
            var parseVoice = new ParseVoice();
            parseVoice.id = voice.objectId;
            if (voice.like) {
                this.$rootScope.currentUser.addUnique('likes', voice.objectId);
                parseVoice.increment('likeCount');
            }
            else {
                this.$rootScope.currentUser.remove('likes', voice.objectId);
                parseVoice.increment('likeCount', -1);
            }
            this.$rootScope.currentUser.save()
                .then(function (user) {
                console.log(user.get('likes'));
            }, function (error) {
                console.error('Error: ' + error.code + ' ' + error.message);
                voice.like = !voice.like;
            });
            parseVoice.save()
                .then(function (parseVoice) {
                console.log(parseVoice.get('likeCount'));
                _this.$scope.$apply(function () {
                    voice.likeCount = parseVoice.get('likeCount');
                });
            }, function (error) {
                console.error('Error: ' + error.code + ' ' + error.message);
            });
        };
        return MainAllController;
    })();
    chavo.MainAllController = MainAllController;
})(chavo || (chavo = {}));
