module chavo {
  'use strict';

  interface INavbarScope extends ng.IScope {
  }

  export class NavbarController {
    /* @ngInject */
    constructor (public $scope: INavbarScope,
      public $rootScope: IChavoRootScope,
      public AuthService: AuthService,
      public $state: ng.ui.IStateService,
      public $location: ng.ILocationService) {
    }

    logIn(formData: { username: string; password: string; }) {
      this.AuthService.logIn(formData, {
        success: (user: Parse.User) => {
          // this.$rootScope.currentUser = user;
          this.$state.go('home');
        },
        error: (user: Parse.User, error: Parse.Error) => {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
          this.$location.path('/login');
        }
      });
    }

    logOut() {
      this.AuthService.logOut();
    }
  }

}
