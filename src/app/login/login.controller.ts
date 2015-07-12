module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope,
      public $rootScope: IChavoRootScope,
      public $state: angular.ui.IStateService,
      public $location: angular.ILocationService,
      public AuthService: AuthService,
      public $q: angular.IQService,
      public FacebookService: FacebookService) {
    }

    signUp(form: { username: string; password: string; }) {
      this.AuthService.signUp(form, {
        success: (user: Parse.User) => {
          // authService でセットしているのでここではコメントアウト
          /*this.$rootScope.currentUser = Parse.User.current();*/
          this.$state.go('home');
        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('Unable to sign up:  ' + error.code + ' ' + error.message);
        }
      });
    }

    loginWithFacebook() {
      this.FacebookService.loginWithFacebookAndGoHome();
    }

    logIn(formData: { username: string; password: string; }) {
      this.AuthService.logIn(formData, {
        success: (user: Parse.User) => {
          // authService でセットしているのでここではコメントアウト
          /*this.$rootScope.currentUser = Parse.User.current();*/
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
