var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(description, author, age, icon, createdAt) {
            this.description = description;
            this.author = author;
            this.age = age;
            this.icon = icon;
            this.createdAt = createdAt;
        }
        return Voice;
    })();
    var MainCtrl = (function () {
        function MainCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.voices = new Array();
            var awesomes = [
                {
                    'description': 'ぱぱ！！',
                    'author': 'あべさんのお子さん',
                    'age': 2.6,
                    'icon': 'angular.png',
                    'createdAt': '2015-06-02'
                }
            ];
            awesomes.forEach(function (awesome) {
                _this.voices.push(awesome);
            });
        }
        return MainCtrl;
    })();
    chavo.MainCtrl = MainCtrl;
})(chavo || (chavo = {}));
