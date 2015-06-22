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
    yearOfToday: string;
  }

  export class SettingsChildController {

    public yearSelected: string;
    public monthOfToday: string;
    public dateOfToday: string;
    public dropDownStatus: {
      yearIsOpen: boolean,
      monthIsOpen: boolean
    };
    public birthYears: number[];

    /* @ngInject */
    constructor (public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateProvider,
        public $stateParams: ng.ui.IStateParamsService) {

      console.log(this.$rootScope.targetChild);

      // 登録済みの場合はその誕生日を表示。未登録なら今日を初期値。
      var momentObj = (this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
      this.yearSelected = momentObj.format('YYYY');
      this.monthOfToday = momentObj.format('MM');
      this.dateOfToday = momentObj.format('DD');

      this.birthYears = new Array<number>();
      for (let i = 1900; i < moment().year(); i++) {
        this.birthYears.push(i);
      }

      this.dropDownStatus = {
        yearIsOpen: false,
        monthIsOpen: false
      };


    }
  }
}
