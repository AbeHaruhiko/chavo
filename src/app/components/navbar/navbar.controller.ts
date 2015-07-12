module chavo {
  'use strict';

  interface INavbarScope extends angular.IScope {
  }

  export class NavbarController {
    /* @ngInject */
    constructor (public $scope: INavbarScope,
      public $rootScope: IChavoRootScope,
      public AuthService: AuthService,
      public $state: angular.ui.IStateService,
      public $location: angular.ILocationService,
      public $q: angular.IQService,
      public FacebookService: FacebookService) {
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
                success: (user: Parse.User) => {
                  this.$state.go('home');
                }
              },
              null,
              null
            );
          });
        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('User cancelled the Facebook login or did not fully authorize.');
        }
      });
    }
  }

}
