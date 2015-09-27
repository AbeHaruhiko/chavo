module chavo {
  'use strict';

  interface ITabMenuScope extends angular.IScope {
  }

  export class TabmenuController {
    /* @ngInject */
    constructor (public $scope: ITabMenuScope,
      public $rootScope: IChavoRootScope) {
    }

    tabs = [
      { heading: 'みんなの', route: 'home.all'},
      { heading: 'あなたの', route: 'home.myposts', disabled: false },
      { heading: 'タグ', route: 'home.tag', disabled: false },
      { heading: '<i class="fa fa-pencil"></i>', route: 'home.compose', disabled: false }
    ];


  }
}
