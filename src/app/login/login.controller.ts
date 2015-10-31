module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  export class LoginController {

    public showResetPwMessage: boolean = false;

    public loginMessage: string;

    /* @ngInject */
    constructor (
      public $scope: IMainScope,
      public $rootScope: IChavoRootScope,
      public $state: angular.ui.IStateService,
      public $location: angular.ILocationService,
      public AuthService: AuthService,
      public $q: angular.IQService,
      public FacebookService: FacebookService
        ) {
    }

    // signUp(form: { username: string; email: string; password: string; }) {
    //   this.AuthService.signUp(form, {
    //     success: (user: Parse.User) => {
    //       // authService でセットしているのでここではコメントアウト
    //       /*this.$rootScope.currentUser = Parse.User.current();*/
    //       this.$state.reload();
    //     },
    //     error: (user: Parse.User, error: Parse.Error) => {
    //       alert('Unable to sign up:  ' + error.code + ' ' + error.message);
    //     }
    //   });
    // }
    //
    loginWithFacebook() {
      this.FacebookService.loginWithFacebookAndGoHome();
    }

    logIn(formData: { username: string; password: string; }) {
      this.AuthService.logIn(formData, {
        success: (user: Parse.User) => {
          // authService でセットしているのでここではコメントアウト
          /*this.$rootScope.currentUser = Parse.User.current();*/
          this.$state.go('home.all');
        },
        error: (user: Parse.User, error: Parse.Error) => {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
          this.$scope.$apply(() => {
            if (error.code === 101) {
              this.loginMessage = 'ユーザー名かパスワードが間違っています。';
            } else if (error.code === 200) {
              this.loginMessage = 'ユーザー名が間違っています。';
            } else if (error.code === 201) {
              this.loginMessage = 'パスワードが間違っています。';
            } else {
              this.loginMessage = 'ログインできませんでした。：' + error.code + ' ' + error.message;
            }
          });
          // this.$state.go('login');
        }
      });
    }

    requestPasswordReset(formData: { email: string; }) {
      this.AuthService.requestPasswordReset(formData, {
        success: () => {
          // $('#resetPwPopoverContainer .popover').popover('hide')
          this.showResetPwMessage = true;
          this.$state.go('login');
        },
        error: (error: Parse.Error) => {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
          this.$state.go('login');
        }
      });
    }

    logOut() {
      this.AuthService.logOut();
    }
  }

}
