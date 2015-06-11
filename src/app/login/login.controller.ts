module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope, public $state: ng.ui.IState) {

    }

    logIn(form) {
          AuthService.logIn(form, {
            success: function(user) {
              this.$scope.$apply(function() {
                $scope.currentUser = user;
                AuthService.currentUser = user;
                if (!user.get('emailVerified')) {
                  $state.go('login');
                  return;
                }

                $state.go('main');
              });
            },
            error: function(user, error) {
              console.log("Unable to login:  " + error.code + " " + error.message);
              $location.path('/login');
            }
          });
        };

    logOut() {
      Parse.User.logOut();
    }
  }

}
