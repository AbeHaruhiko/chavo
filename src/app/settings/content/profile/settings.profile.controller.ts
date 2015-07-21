module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsProfileController {
    /* @ngInject */
    constructor (public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {
    }

    public saveProfile() {

      this.$rootScope.currentUser.save()
      .then((user: Parse.User) => {
        console.log('ほぞんしました');
      }, (error: Parse.Error) => {
        console.log('Error: ' + error.code + ' ' + error.message);
      });

    }
  }
}
