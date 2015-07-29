module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsProfileController {

    public profile: Profile;

    /* @ngInject */
    constructor (
      public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {

        this.profile = new Profile($rootScope.currentUser.get('nickname'),
            $rootScope.currentUser.getEmail(),
            null);
    }

    public saveProfile() {

      var profInput: { nickname: string; username: string; email: string; password?: string } = {
        nickname: this.profile.nickname,
        username: this.profile.email,
        email: this.profile.email
      };

      if (this.profile.password) {
        profInput.password = this.profile.password;
      }

      this.$rootScope.currentUser.save(profInput)
      .then((user: Parse.User) => {
        console.log('ほぞんしました');
      }, (error: Parse.Error) => {
        console.log('Error: ' + error.code + ' ' + error.message);
      });

    }
  }
}
