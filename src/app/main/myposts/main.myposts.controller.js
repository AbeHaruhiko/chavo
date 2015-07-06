var chavo;
(function (chavo) {
    'use strict';
    var MainMyPostsController = (function () {
        function MainMyPostsController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.voices = new Array();
            var ParseVoice = Parse.Object.extend('Voice');
            var query = new Parse.Query(ParseVoice);
            query.descending('createdAt');
            query.equalTo('user', Parse.User.current());
            query.find({
                success: function (results) {
                    results.forEach(function (voice) {
                        _this.voices.push(new chavo.Voice(voice.get('description'), voice.get('author'), (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '', voice.get('gender') == 0 ? '男の子' : voice.get('gender') == 1 ? '女の子' : '', null, moment(voice.createdAt).format('YYYY/MM/DD').toString()));
                    });
                    _this.$scope.$apply();
                },
                error: function (error) {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });
        }
        return MainMyPostsController;
    })();
    chavo.MainMyPostsController = MainMyPostsController;
})(chavo || (chavo = {}));
