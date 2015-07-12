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
      this.AuthService.loginWithFacebook({
        success: (user: Parse.User) => {

          this.$rootScope.currentUser = Parse.User.current();


          this.$q.all([
            this.FacebookService.api('/me'),
            this.FacebookService.api('/' + user.get('authData').facebook.id + '/picture')
          ])
          .then((response: any[]) => {
            this.$rootScope.currentUser.setUsername(response[0].name);
            this.$rootScope.currentUser.set('iconUrl', response[1].data.url);
            this.$rootScope.currentUser.save({
                error: (user: Parse.User, error: Parse.Error) => {
                  console.error(error.code + ":" + error.message);
                }
              },
              null,
              null
            )
            .then(() => {
              this.$state.go('home');
            });
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
