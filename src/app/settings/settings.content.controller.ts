module chavo {
  'use strict';

  interface ISettingsContent extends ng.IScope {
  }

  export class SettingsContentController {
    /* @ngInject */
    constructor (public $scope: ISettingsContent,
      public $rootScope: IChavoRootScope) {
    }
  }
}
