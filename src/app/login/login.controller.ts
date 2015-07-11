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
          this.$state.go('home');
        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('Unable to sign up:  ' + error.code + ' ' + error.message);
        }
      });
    }

    public signUpWithFacebook() {
      Parse.FacebookUtils.logIn('public_profile, email', {
        success: (user: Parse.User) => {
          /*if (!user.existed()) {
            alert('User signed up and logged in through Facebook!');
          } else {
            alert('User logged in through Facebook!');
          }*/
          this.$state.go('home');

        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('User cancelled the Facebook login or did not fully authorize.');
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
