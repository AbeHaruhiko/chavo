module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope, public $state: ng.ui.IStateService, public $location, public AuthService: AuthService) {

    }

    signUp(form) {
      this.AuthService.signUp(form, {
        success: (user) => {
          this.$scope.$apply(() => {
            this.$state.go('login');
          });
        },
        error: (user, error) => {
          alert("Unable to sign up:  " + error.code + " " + error.message);
        }
      });
    }

    logIn(form) {
      this.AuthService.logIn(form, {
        success: user => {
          this.$scope.$apply(() => {
            if (!user.get('emailVerified')) {
              this.$state.go('main');
              return;
            }

            this.$state.go('main');
          });
        },
        error: (user, error) => {
          console.log("Unable to login:  " + error.code + " " + error.message);
          this.$location.path('/login');
        }
      });
    };

    logOut() {
      this.AuthService.logOut();
    }
  }

}
