module chavo {
  'use strict';

  interface INavbarScope extends angular.IScope {
  }

  export class NavbarController {

    notificationCount: number = 0;

    /* @ngInject */
    constructor (public $scope: INavbarScope,
        public $rootScope: IChavoRootScope,
        public AuthService: AuthService,
        public $state: angular.ui.IStateService,
        public $location: angular.ILocationService,
        public $q: angular.IQService,
        public FacebookService: FacebookService) {

      this.updateNotification();
    }

    logIn(formData: { username: string; password: string; }) {
      this.AuthService.logIn(formData, {
        success: (user: Parse.User) => {
          this.updateNotification();
          // this.$rootScope.currentUser = user;
          this.$state.go('home.all');
        },
        error: (user: Parse.User, error: Parse.Error) => {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
          // this.$location.path('/login');
          this.$state.go('login');
        }
      });
    }

    logOut() {
      this.updateNotification();
      this.AuthService.logOut()
      .then(() => {
        this.$state.go('top');
      });
    }

    loginWithFacebook() {
      this.updateNotification();
      this.FacebookService.loginWithFacebookAndGoHome();
    }

    fetchUser() {
      Parse.User.current().fetch()
      .then((user: Parse.User) => {
        this.$rootScope.$apply(() => {
          this.$rootScope.currentUser = Parse.User.current();
        });
      },
      (error: Parse.Error) => {
        console.error('Error: ' + error.code + ' ' + error.message);
      });
    }

    updateNotification() {
      Parse.Cloud.run('getCountOfFamilyAppToRequestUser')
      .then((count: number) => {
        this.$scope.$apply(() => {
          this.notificationCount = count;
        });
      });
    }
  }

}
