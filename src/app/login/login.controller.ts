module chavo {
  'use strict';

  interface IMainScope extends ng.IScope {
  }

  export class LoginController {

    /* @ngInject */
    constructor (public $scope: IMainScope) {

    }

    logOut() {
      // Parse.User.logOut();
    }
  }

}
