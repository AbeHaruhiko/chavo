var chavo;
(function (chavo) {
    'use strict';
    var WhenScrollController = (function () {
        function WhenScrollController($scope, $rootScope, $element, $attrs, $document, $window) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$element = $element;
            this.$attrs = $attrs;
            this.$document = $document;
            this.$window = $window;
            angular.element($window).bind('scroll', _.throttle(function () {
                var docHeight = angular.element(document).height();
                var scrollPosition = angular.element(window).height() + angular.element(window).scrollTop();
                var distanceToBottome = docHeight - scrollPosition;
                if (_this.prevDistanceToBottom < distanceToBottome) {
                    return;
                }
                if ((distanceToBottome) > 100) {
                    return;
                }
                $scope.$apply($scope.run);
                _this.prevDistanceToBottom = distanceToBottome;
            }, 200));
        }
        WhenScrollController.unbind = function () {
            angular.element(window).unbind('scroll');
        };
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
