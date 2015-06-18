module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
  }

  export class SettingsChildrenController {
    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope) {
    }

    children = [
      { nickName: 'もも'},
      { nickName: 'あお'},
    ];


  }
}
