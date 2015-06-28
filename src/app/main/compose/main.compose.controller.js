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
                { label: 'その他・表示しない', value: chavo.GENDER.OTHER }];
            this.children.push(new chavo.Child(0, '指定しない', null, null, null));
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
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
