var chavo;
(function (chavo) {
    'use strict';
    var WhenScrollController = (function () {
        function WhenScrollController($scope, $rootScope, $element, $attrs, $document, $window) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.$document = $document;
            this.$window = $window;
            angular.element($window).bind('scroll', function () {
                var docHeight = angular.element(document).height();
                var scrollPosition = angular.element(window).height() + angular.element(window).scrollTop();
                if ((docHeight - scrollPosition) < 100) {
                    $scope.$apply($scope.run);
                }
            });
        }
        return WhenScrollController;
    })();
    chavo.WhenScrollController = WhenScrollController;
    var WhenScrollDerective = (function () {
        function WhenScrollDerective() {
        }
        WhenScrollDerective.ddo = function () {
            return {
                restrict: 'E',
                controller: WhenScrollController,
                controllerAs: 'when_scroll',
                scope: {
                    run: '&cvRun'
                }
            };
        };
        return WhenScrollDerective;
    })();
    chavo.WhenScrollDerective = WhenScrollDerective;
})(chavo || (chavo = {}));
