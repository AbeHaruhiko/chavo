var chavo;
(function (chavo) {
    'use strict';
    var MainComposeController = (function () {
        function MainComposeController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.children = new Array();
            this.genderList = [{ label: '男の子', value: chavo.GENDER.MALE },
                { label: '女の子', value: chavo.GENDER.FEMALE },
                { label: '非表示', value: chavo.GENDER.OTHER }];
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.ascending('dispOrder');
            query.find({
                error: function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                results.forEach(function (parseChild) {
                    var years = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
                    var months = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));
                    _this.$scope.$apply(function () {
                        _this.children.push(new chavo.Child(parseChild.get('dispOrder'), parseChild.get('nickName'), parseChild.get('birthday'), parseChild.get('gender'), years ? years : null, months ? months : null));
                    });
                });
            });
        }
        MainComposeController.prototype.onSelectVoiceAuthor = function (child) {
            this.voiceAuthorSelected = child;
            this.voiceAuthor = angular.copy(child);
        };
        MainComposeController.prototype.submit = function () {
            var ParseVoice = Parse.Object.extend('Voice');
            var voice = new ParseVoice();
            voice.set('description', this.voice.description);
            voice.save();
        };
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
