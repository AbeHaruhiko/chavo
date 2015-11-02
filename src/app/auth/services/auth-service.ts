module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  export class AuthService {

    /* @ngInject */
    constructor (public $state: ng.ui.IStateService, public $rootScope: IChavoRootScope) {

    }

    signUp(form: { username: string; email: string; password: string; }, callbacks: any) {
      var user = new Parse.User();
      user.set('username', form.username);
      user.set('email', form.email);
      user.set('password', form.password);

      user.signUp(null, callbacks)
      .then((user: Parse.User) => {
        this.$rootScope.currentUser = user;
      });
    }

    loginWithFacebook(callbacks: any) {
      Parse.FacebookUtils.logIn(null, callbacks);
    }

    logIn(authData: { username: string; password: string; }, callbacks: any) {
      Parse.User.logIn(authData.username, authData.password, callbacks)
        .then((user: Parse.User) => {
          this.$rootScope.currentUser = user;
        });
    }

    requestPasswordReset(authData: { email: string }, callbacks: any) {
      Parse.User.requestPasswordReset(authData.email, callbacks)
        .then(() => {
          console.log('password reset done.');
        });
    }

    logOut(): Parse.IPromise<{}> {
      return Parse.User.logOut()
        .then(() => {
          this.$rootScope.currentUser = null;
        });
    }
  }
}
