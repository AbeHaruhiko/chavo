module chavo {
  'use strict';

  export class Child {
    constructor(public id: number,
      public nickName?: string,
      public birthday?: Date,
      public gender: GENDER = GENDER.OTHER,
      public age?: string) {
    }
  }

  export enum GENDER {
    MALE,
    FEMALE,
    OTHER
  }

  interface ISettingsChild extends ng.IScope {
    child: Child;
    yearOfToday: string;
  }

  export class SettingsChildController {

    // 生年月日の選択値
    public yearSelected: string;
    public monthSelected: string;
    public dateSelected: string;

    // DropDownの開閉状態
    public dropDownStatus: {
      yearIsOpen: boolean;
      monthIsOpen: boolean;
      dateIsOpen: boolean;
    };

    // 選択肢
    public birthYears: number[];
    public birthMonths: number[];
    public birthDates: number[];

    /* @ngInject */
    constructor (public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateProvider,
        public $stateParams: ng.ui.IStateParamsService) {

      console.log(this.$rootScope.targetChild);

      // 登録済みの場合はその誕生日を表示。未登録なら今日を初期値。
      var momentObj = (this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
      this.yearSelected = momentObj.format('YYYY');
      this.monthSelected = momentObj.format('MM');
      this.dateSelected = momentObj.format('DD');

      this.birthYears = new Array<number>();
      for (let i = 1900; i <= moment().year(); i++) {
        this.birthYears.push(i);
      }

      this.birthMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      this.birthDates = new Array<number>();
      for (let i = 1; i <= 31; i++) {
        this.birthDates.push(i);
      }

      this.dropDownStatus = {
        yearIsOpen: false,
        monthIsOpen: false,
        dateIsOpen: false
      };


    }
  }
}
