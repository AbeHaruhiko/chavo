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

    menuItems = [
      { title: 'プロフィール', route: 'settings.profile'},
      { title: 'こどもの情報', route: 'settings.children'},
      { title: 'かぞくの情報', route: 'settings.family'}
    ];
  }
}
