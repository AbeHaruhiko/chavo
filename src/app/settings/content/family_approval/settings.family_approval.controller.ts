module chavo {
  'use strict';

  interface ISettingsChild extends angular.IScope {
    child: Child;
  }

  export class SettingsFamilyApprovalController {

    /* @ngInject */
    constructor (
        public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $q: angular.IQService) {

    }
  }
}
