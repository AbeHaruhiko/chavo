module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsMenuController {

    public activeMenu: string;

    /* @ngInject */
    constructor (public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {
    }

    menus = [
      { title: 'プロフィール', route: 'settings.profile'},
      { title: 'こどもの情報', route: 'settings.children'},
    ];

    public isActive(menuName: string) {
      return menuName === this.activeMenu;
    }

  }
}
