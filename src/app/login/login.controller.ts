module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService,
      public $location: ng.ILocationService,
      public AuthService: AuthService) {
    }

    signUp(form: { username: string; password: string; }) {
      this.AuthService.signUp(form, {
        success: (user: Parse.User) => {
          this.$scope.$apply(() => {
            this.$state.go('login');
          });
        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('Unable to sign up:  ' + error.code + ' ' + error.message);
        }
      });
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
