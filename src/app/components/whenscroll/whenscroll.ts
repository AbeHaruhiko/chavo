module chavo {
  'use strict';

  export interface IWhenScrollScope extends angular.IScope {
    run(): Function;
  }

  export class WhenScrollController {

    prevDistanceToBottom: number;

    /* @ngInject */
    constructor (
      public $scope: IWhenScrollScope,
      public $rootScope: IChavoRootScope,
      public $element: any,
      public $attrs: any,
      public $document: any,
      public $window: any
    ) {
// $scope.$parent['main_all'].loadMore();


      angular.element($window).bind('scroll', _.throttle(() => {
        var docHeight = angular.element(document).height();
      	var scrollPosition = angular.element(window).height() + angular.element(window).scrollTop();
        var distanceToBottome = docHeight - scrollPosition;
        if (this.prevDistanceToBottom < distanceToBottome) {
          // 上にスクロールしているときはなにもしない
          return;
        }

        // console.log(docHeight - scrollPosition);
      	if ((distanceToBottome)  > 100) {
          return;
        }
        // ページ最下部手前100pxまでスクロールしてきた
        // console.log('got to end');
        $scope.$apply($scope.run);
        this.prevDistanceToBottom = distanceToBottome;
      }, 200));
    }

    static unbind() {
      angular.element(window).unbind('scroll');
    }
  }

  export class WhenScrollDerective {

//     static link($scope: IMainScope, element: any, attribute: any, controllers: any) {
//       var raw = element[0];
// // $scope.$parent['main_all'].loadMore();
//       element.bind('scroll', () => {
//           if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
//               $scope.$apply(attribute.cvRun);
//           }
//       });
//     }

    static ddo() {
      return {
        restrict: 'E',
        controller: WhenScrollController,
        controllerAs: 'when_scroll',
        // require: '^MainAllController',
        scope: {
          run: '&cvRun'
        }
        // template: '<div></div>',
        // link: WhenScrollDerective.link
      };
    }
  }
}
