module chavo {
  'use strict';

  interface IMainScope extends angular.IScope {
  }

  /**
   * based on https://github.com/pc035860/angular-easyfb/blob/master/angular-easyfb.js
   */
  export class FacebookService {

    /* @ngInject */
    constructor (public $q: ng.IQService, public $rootScope: IChavoRootScope) {

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
        if (!this.$rootScope.$$phase) {
          this.$rootScope.$apply();
        }
      };

      FB.api.apply(FB, args);
      return deferred.promise;
    }
  }
}
