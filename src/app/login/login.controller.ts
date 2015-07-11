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
      public AuthService: AuthService) {
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

    public signUpWithFacebook() {
      this.AuthService.signUpWithFacebook({
        success: (user: Parse.User) => {

          this.$rootScope.currentUser = Parse.User.current();
          FB.api('/me', 'GET', (response: any) => {
                console.log('Successful login for: ' + response.name);
                user.setUsername(response.name);
                this.$state.go('home');
          });


        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('User cancelled the Facebook login or did not fully authorize.');
        }
      });
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
