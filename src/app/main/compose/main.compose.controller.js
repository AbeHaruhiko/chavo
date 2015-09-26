var chavo;
(function (chavo) {
    'use strict';
    var MainComposeController = (function () {
        function MainComposeController($scope, $rootScope, $state, $stateParams, cfpLoadingBar, $q) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.cfpLoadingBar = cfpLoadingBar;
            this.$q = $q;
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
            this.voiceIsPublic = this.voice.isPublic;
            var fileSelector = angular.element('#photo-selector');
            fileSelector.fileinput({
                dropZoneEnabled: false,
                showUpload: false,
                showCaption: false,
                showPreview: true,
                browseClass: 'photo-browse-btn btn btn-primary btn-outline',
                browseLabel: '画像選択'
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
            this.disableInput = true;
            var fileSelector = angular.element('#photo-selector');
            if (fileSelector[0].files.length > 0) {
                var file = fileSelector[0].files[0];
                var name = 'photo.jpg';
                var parseFile = new Parse.File(name, file);
                parseFile.save().then(function () {
                    var parseVoice = _this.makeParseVoice();
                    parseVoice.set('photo', parseFile);
                    parseVoice.set('photoUrl', parseFile.url());
                    return parseVoice.save({
                        error: function (voice, error) {
                            console.log('Error: ' + error.code + ' ' + error.message);
                        }
                    });
                }).then(function () {
                    console.log('ほぞんしました');
                    _this.$state.go('home.all');
                }, function (error) {
                    console.error('投稿送信時エラー: ' + error.code + ' ' + error.message);
                    this.alertMsg = '送信に失敗しました...時間をおいてためしてください。';
                    this.disableInput = false;
                    this.$scope.$apply();
                });
            }
            else {
                var parseVoice = this.makeParseVoice();
                parseVoice.save({
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
            }
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
        MainComposeController.prototype.loadTags = function (queryString) {
            var ParseTag = Parse.Object.extend('Tag');
            var query = new Parse.Query(ParseTag);
            query.select('tag');
            query.startsWith('tag', queryString);
            var tags = [];
            var deferred = this.$q.defer();
            query.find().then(function (results) {
                results.forEach(function (result) {
                    tags.push({ text: result.get('tag') });
                });
                deferred.resolve(tags);
            }, null);
            return deferred.promise;
        };
        MainComposeController.prototype.makeParseVoice = function () {
            var ParseVoice = Parse.Object.extend('Voice');
            var parseVoice = new ParseVoice();
            if (this.voice.objectId) {
                parseVoice.id = this.voice.objectId;
            }
            parseVoice.set('description', this.voice.description);
            parseVoice.set('tags', this.voice.tags);
            parseVoice.set('gender', this.voiceAuthor ? this.voiceAuthor.gender : chavo.GENDER.OTHER);
            parseVoice.set('author', this.voiceAuthor ? this.voiceAuthor.nickName : null);
            parseVoice.set('ageYears', this.voiceAuthor ? this.voiceAuthor.ageYears : null);
            parseVoice.set('ageMonths', this.voiceAuthor ? this.voiceAuthor.ageMonths : null);
            parseVoice.set('user', Parse.User.current());
            var voiceACL = new Parse.ACL(Parse.User.current());
            if (this.voiceIsPublic) {
                voiceACL.setPublicReadAccess(true);
            }
            parseVoice.setACL(voiceACL);
            return parseVoice;
        };
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
