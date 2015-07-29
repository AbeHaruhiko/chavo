module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  export class AuthService {

    /* @ngInject */
    constructor (public $state: ng.ui.IStateService, public $rootScope: IChavoRootScope) {

    }

    signUp(form: { username: string; password: string; }, callbacks: any) {
      var user = new Parse.User();
      user.set('email', form.username);
      user.set('username', form.username);
      user.set('nickname', form.username);  // 初期値では、userid, email, nicknameはすべてメールアドレス。メールアドレスとパスワードのみで登録させたいため。
      user.set('password', form.password);

      user.signUp(null, callbacks);
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

    logOut() {
      Parse.User.logOut()
        .then(() => {
          this.$rootScope.currentUser = null;
        });
    }
  }
}
