var chavo;
(function (chavo) {
    'use strict';
    var MainComposeController = (function () {
        function MainComposeController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.children = new Array();
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.ascending('dispOrder');
            query.find({
                error: function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                results.forEach(function (parseChild) {
                    var years = moment().diff(moment(parseChild.get('birthday')), 'years');
                    var months = moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * years);
                    _this.children.push(new chavo.Child(parseChild.get('dispOrder'), parseChild.get('nickName'), parseChild.get('birthday'), parseChild.get('gender'), (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '')));
                });
            });
        }
        return MainComposeController;
    })();
    chavo.MainComposeController = MainComposeController;
})(chavo || (chavo = {}));
