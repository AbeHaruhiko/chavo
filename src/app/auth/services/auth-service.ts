module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class AuthService {

    /* @ngInject */
    constructor (public $state: ng.ui.IStateService) {

    }

    signUp(form, callbacks) {
      var user = new Parse.User();
      user.set("email", form.username);
      user.set("username", form.username);
      user.set("password", form.password);

      user.signUp(null, callbacks);
    }

    logIn(form, callbacks) {
      Parse.User.logIn(form.username, form.password, callbacks);
    }

    logOut() {
      Parse.User.logOut();
      this.$state.go("home");
    }
  }
}
