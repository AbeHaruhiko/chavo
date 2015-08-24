var chavo;
(function (chavo) {
    'use strict';
    var MainMyPostsController = (function () {
        function MainMyPostsController($scope, cfpLoadingBar) {
            var _this = this;
            this.$scope = $scope;
            this.cfpLoadingBar = cfpLoadingBar;
            this.voices = new Array();
            var ParseVoice = Parse.Object.extend('Voice');
            var query = new Parse.Query(ParseVoice);
            var parseVoices;
            cfpLoadingBar.start();
            query.descending('createdAt');
            query.equalTo('user', Parse.User.current());
            query.find({
                success: function (results) {
                },
                error: function (error) {
                    alert('Error: ' + error.code + ' ' + error.message);
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
                    _this.voices.push(new chavo.Voice(voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').get('iconUrl') === undefined ?
                        voice.get('icon') === undefined ? null : voice.get('icon').url()
                        : voice.get('user').get('iconUrl'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            }, function (error) {
                // 投稿ユーザがいない場合などエラーになる
                parseVoices.forEach(function (voice) {
                    if (voice.get('user').get('username') !== undefined) {
                        _this.voices.push(new chavo.Voice(voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '', voice.get('user').get('username'), voice.get('user').get('iconUrl') === undefined ?
                            voice.get('icon') === undefined ? null : voice.get('icon').url()
                            : voice.get('user').get('iconUrl'), moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                    }
                });
                cfpLoadingBar.complete();
                _this.$scope.$apply();
            });
        }
        return MainMyPostsController;
    })();
    chavo.MainMyPostsController = MainMyPostsController;
})(chavo || (chavo = {}));
