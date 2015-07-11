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
      public $location: angular.ILocationService) {
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
  }

}
