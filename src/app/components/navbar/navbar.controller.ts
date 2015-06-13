module chavo {
  'use strict';

  interface INavbarScope extends ng.IScope {
  }

  export class NavbarController {
    /* @ngInject */
    constructor (public $scope: INavbarScope, public $rootScope: IChavoRootScope, public AuthService: AuthService) {
    }

    logOut() {
      this.AuthService.logOut();
    }
  }

}
