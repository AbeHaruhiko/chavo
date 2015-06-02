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
            var awesomeThings = [
                {
                    'title': 'AngularJS',
                    'url': 'https://angularjs.org/',
                    'description': 'HTML enhanced for web apps!',
                    'logo': 'angular.png'
                }
            ];
            $scope.awesomeThings = new Array();
            awesomeThings.forEach(function (awesomeThing) {
                $scope.awesomeThings.push(awesomeThing);
            });
        }
        return MainCtrl;
    })();
    chavo.MainCtrl = MainCtrl;
})(chavo || (chavo = {}));
