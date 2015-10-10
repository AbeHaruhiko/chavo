module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
  }

  export class SettingsFamilyController {

    children = new Array<Child>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService,
      public cfpLoadingBar: any) {

    }
  }
}
