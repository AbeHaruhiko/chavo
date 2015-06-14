module chavo {
  'use strict';

  interface ITabMenuScope extends ng.IScope {
  }

  export class TabmenuController {
    /* @ngInject */
    constructor (public $scope: ITabMenuScope,
      public $rootScope: IChavoRootScope) {
    }

    tabs = [
      { heading:'Dynamic Title 1', route: 'home.all'},
      { heading:'Dynamic Title 2', route: 'home.myposts', disabled: true }
    ];


  }
}
