module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsMenuController {

    /* @ngInject */
    constructor (
      public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService) {
    }

    menus = [
      { title: 'プロフィール', route: 'settings.profile'},
      { title: 'こどもの情報', route: 'settings.children'},
    ];
  }
}
