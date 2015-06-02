var chavo;
(function (chavo) {
    'use strict';
    var Thing = (function () {
        function Thing(title, url, description, logo) {
            this.title = title;
            this.url = url;
            this.description = description;
            this.logo = logo;
            this.rank = Math.random();
        }
        return Thing;
    })();
    var MainCtrl = (function () {
        function MainCtrl($scope) {
            var _this = this;
            this.$scope = $scope;
            this.awesomeThings = new Array();
            var awesomes = [
                {
                    'title': 'AngularJS',
                    'url': 'https://angularjs.org/',
                    'description': 'HTML enhanced for web apps!',
                    'logo': 'angular.png'
                }
            ];
            awesomes.forEach(function (awesome) {
                _this.awesomeThings.push(awesome);
            });
        }
        return MainCtrl;
    })();
    chavo.MainCtrl = MainCtrl;
})(chavo || (chavo = {}));
