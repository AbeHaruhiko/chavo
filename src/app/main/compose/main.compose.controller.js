var chavo;
(function (chavo) {
    'use strict';
    var MainComposeController = (function () {
        function MainComposeController($scope, $rootScope, $state, $stateParams) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.children = new Array();
            this.genderList = [{ label: '男の子', value: chavo.GENDER.MALE },
                { label: '女の子', value: chavo.GENDER.FEMALE },
                { label: '非表示', value: chavo.GENDER.OTHER }];
            this.voiceIsPublic = false;
            this.disableInput = false;
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
            this.voice = $stateParams['voice'];
            this.voiceAuthor = this.voiceAuthor || new chavo.Child();
            this.voiceAuthor.nickName = this.voice.speaker;
            this.voiceAuthor.ageYears = this.voice.ageYears;
            this.voiceAuthor.ageMonths = this.voice.ageMonths;
            this.voiceAuthor.gender = this.voice.genderValue;
        }
        MainComposeController.prototype.onSelectVoiceAuthor = function (child) {
            this.voiceAuthor = angular.copy(child);
        };
        MainComposeController.prototype.clearVoiceAuthor = function () {
            this.voiceAuthor = null;
        };
        MainComposeController.prototype.submit = function () {
            var _this = this;
            this.disableInput = true;
            var ParseVoice = Parse.Object.extend('Voice');
            var voice = new ParseVoice();
            voice.set('description', this.voice.description);
            voice.set('gender', this.voiceAuthor ? this.voiceAuthor.gender : chavo.GENDER.OTHER);
            voice.set('author', this.voiceAuthor ? this.voiceAuthor.nickName : null);
            voice.set('ageYears', this.voiceAuthor ? this.voiceAuthor.ageYears : null);
            voice.set('ageMonths', this.voiceAuthor ? this.voiceAuthor.ageMonths : null);
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
            }, function (error) {
                console.error('投稿送信時エラー: ' + error.code + ' ' + error.message);
                _this.alertMsg = '送信に失敗しました...時間をおいてためしてください。';
                _this.disableInput = false;
                _this.$scope.$apply();
            });
        };
        MainComposeController.prototype.fetchUser = function () {
            var _this = this;
            Parse.User.current().fetch()
                .then(function (user) {
                _this.$rootScope.$apply(function () {
                    _this.$rootScope.currentUser = Parse.User.current();
                });
            }, function (error) {
                console.error('Error: ' + error.code + ' ' + error.message);
            });
        };
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
