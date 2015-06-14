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
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];


  }
}
