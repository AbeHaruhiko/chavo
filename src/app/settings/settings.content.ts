module chavo {
  'use strict';

  interface ISettingsContent extends ng.IScope {
  }

  export class SettingsContentController {
    /* @ngInject */
    constructor (public $scope: ISettingsContent,
      public $rootScope: IChavoRootScope) {
    }

    menus = [
      { title:'プロフィール', route: 'settings.profile'},
      { title:'こどもの情報', route: 'settings.children'},
    ];


  }
}
