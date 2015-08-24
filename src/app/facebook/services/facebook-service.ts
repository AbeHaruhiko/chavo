module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  /**
   * based on https://github.com/pc035860/angular-easyfb/blob/master/angular-easyfb.js
   */
  export class FacebookService {

    /* @ngInject */
    constructor (
      public $q: ng.IQService,
      public $rootScope: IChavoRootScope,
      public AuthService: AuthService,
      public $state: angular.ui.IStateService,
      public $timeout: angular.ITimeoutService
      ) {

    }

    public api(...dummy: any[]) {
      var deferred = this.$q.defer();
      var args = arguments;
      args[args.length++] = (response: any) => {
        if (response.error) {
          deferred.reject(response.error);
        }
        if (response.error_msg) {
          deferred.reject(response);
        } else {
          deferred.resolve(response);
        }
      };

      FB.api.apply(FB, args);
      return deferred.promise;
    }

    public loginWithFacebookAndGoHome() {
      this.AuthService.loginWithFacebook({
        success: (user: Parse.User) => {

          this.$rootScope.currentUser = Parse.User.current();


          this.$q.all([
            this.api('/me'),
            this.api('/' + user.get('authData').facebook.id + '/picture')
          ])
          .then((response: any[]) => {
            this.$timeout(() => {
              this.$rootScope.currentUser.setUsername(response[0].name);
            });
            this.$rootScope.$apply();
            this.$rootScope.currentUser.set('iconUrl', response[1].data.url);
            this.$rootScope.currentUser.save({
                error: (user: Parse.User, error: Parse.Error) => {
                  console.error(error.code + ':' + error.message);
                }
              },
              null,
              null
            )
            .then(() => {
              this.$state.go('home.all');
            });
          });
        },
        error: (user: Parse.User, error: Parse.Error) => {
          alert('User cancelled the Facebook login or did not fully authorize.');
        }
      });
    }

  }
}
