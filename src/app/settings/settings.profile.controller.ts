module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsProfileController {
    /* @ngInject */
    constructor (public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {
    }
  }
}
