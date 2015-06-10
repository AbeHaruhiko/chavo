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
    var MainController = (function () {
        function MainController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.voices = new Array();
            var awesomes = [
                {
                    'description': '中華料理屋さんで。\n私「何食べたい？」\n子「ベイマックス！！！！！！！」\n私「えっ」\n\n子が指差す先を見ると・・・・酢豚の「パイナップル」（笑語呂がにてるっちゃにてるｗｗｗ',
                    'author': 'あべさんのお子さん',
                    'age': 2.6,
                    'icon': 'angular.png',
                    'createdAt': '2015-06-02'
                }, {
                    'description': 'ぱぱ！！',
                    'author': 'あべさんのお子さん',
                    'age': 2.6,
                    'icon': 'ic_hal.jpg',
                    'createdAt': '2015-06-02'
                }
            ];
            awesomes.forEach(function (awesome) {
                _this.voices.push(awesome);
            });
        }
        return MainController;
    })();
    chavo.MainController = MainController;
})(chavo || (chavo = {}));
