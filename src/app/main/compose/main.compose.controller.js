var chavo;
(function (chavo) {
    'use strict';
    var MainComposeController = (function () {
        function MainComposeController($scope, $state) {
            var _this = this;
            this.$scope = $scope;
            this.$state = $state;
            this.children = new Array();
            this.genderList = [{ label: '男の子', value: chavo.GENDER.MALE },
                { label: '女の子', value: chavo.GENDER.FEMALE },
                { label: '非表示', value: chavo.GENDER.OTHER }];
            this.voiceIsPublic = false;
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.ascending('dispOrder');
            query.find({
                error: function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                results.forEach(function (parseChild) {
                    if (parseChild.get('birthday')) {
                        var years = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
                        var months = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));
                    }
                    _this.$scope.$apply(function () {
                        _this.children.push(new chavo.Child(parseChild.get('dispOrder'), parseChild.get('nickName'), parseChild.get('birthday'), parseChild.get('gender'), years ? years : null, months ? months : null, !parseChild.get('birthday')));
                    });
                });
            });
        }
        MainComposeController.prototype.onSelectVoiceAuthor = function (child) {
            this.voiceAuthor = angular.copy(child);
        };
        MainComposeController.prototype.clearVoiceAuthor = function () {
            this.voiceAuthor = null;
        };
        MainComposeController.prototype.submit = function () {
            var _this = this;
            var ParseVoice = Parse.Object.extend('Voice');
            var voice = new ParseVoice();
            voice.set('description', this.voice.description);
            voice.set('gender', this.voiceAuthor.gender);
            voice.set('author', this.voiceAuthor.nickName);
            voice.set('ageYears', this.voiceAuthor.ageYears);
            voice.set('ageMonths', this.voiceAuthor.ageMonths);
            voice.set('user', Parse.User.current());
            var voiceACL = new Parse.ACL(Parse.User.current());
            if (this.voiceIsPublic) {
                voiceACL.setPublicReadAccess(true);
            }
            voice.setACL(voiceACL);
            voice.save({
                error: function (voice, error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function () {
                console.log('ほぞんしました');
                _this.$state.go('home.all');
            });
        };
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
