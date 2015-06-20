module chavo {
  'use strict';

  export class Child {
    constructor(public id: number,
      public nickName: string,
      public birthday: Date,
      public sex: number,
      public age?: string) {
    }
  }


  interface ISettingsChild extends ng.IScope {
    child: Child;
    minDate: Date;
    datePickerOpen: boolean;
    formats: string[];
    format: string;
    dateOptions: { formatYear: string; startingDay: number }
    dt: Date;
  }

  export class SettingsChildController {

    /* @ngInject */
    constructor (public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateProvider,
        public $stateParams: ng.ui.IStateParamsService) {

      console.log(this.$rootScope.targetChild);

      this.$scope.minDate = $scope.minDate ? null : new Date();

      this.$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      this.$scope.format = $scope.formats[0];

      this.$scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      this.$scope.dt = new Date();
    }

    open ($event: UIEvent) {
      $event.preventDefault();
      $event.stopPropagation();

      this.$scope.datePickerOpen = !this.$scope.datePickerOpen;
    }
  }
}
