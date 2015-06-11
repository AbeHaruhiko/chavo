module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope, public $state: ng.ui.IState, public $location, public AuthService: AuthService) {

    }

    logIn(form) {
      this.AuthService.logIn(form, {
        success: user => {
          this.$scope.$apply(function() {
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
      Parse.User.logOut();
    }
  }

}
