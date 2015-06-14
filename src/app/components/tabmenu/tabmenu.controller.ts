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
      { heading:'すべて', route: 'home.all'},
      { heading:'あなた', route: 'home.myposts', disabled: false }
    ];


  }
}
