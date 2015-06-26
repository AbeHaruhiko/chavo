module chavo {
  'use strict';

  export class Child {
    constructor(public dispOrder: number = 0,
        public nickName: string = null,
        public birthday: Date = null,
        public gender: GENDER = GENDER.OTHER,
        public age: string = null) {
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

    // dropDownの開閉状態
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
      var momentObj = (this.$rootScope.targetChild && this.$rootScope.targetChild.birthday ? moment(this.$rootScope.targetChild.birthday) : moment());
      this.yearSelected = momentObj.format('YYYY');
      this.monthSelected = momentObj.format('M');
      this.dateSelected = momentObj.format('D');

      this.birthYears = new Array<number>();
      for (var i = 1900; i <= moment().year(); i++) {
        this.birthYears.push(i);
      }

      this.birthMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      this.birthDates = new Array<number>();
      for (i = 1; i <= 31; i++) {
        this.birthDates.push(i);
      }

      this.dropDownStatus = {
        yearIsOpen: false,
        monthIsOpen: false,
        dateIsOpen: false
      };
    }

    private getInputBirthday(): Date {
      return moment({ year: this.yearSelected,
          months: +this.monthSelected - 1, /* month index begins from 0. '+' casts string to number. */
          date: this.dateSelected })
        .toDate();
    }

    public saveChildData() {

      if (this.$rootScope.targetChild.dispOrder > 0) {
        // 登録済みのこどもの更新の場合

        var ParseChild = Parse.Object.extend('Child');
        var query = new Parse.Query(ParseChild);
        query.equalTo('dispOrder', this.$rootScope.targetChild.dispOrder);
        query.first().then((child: Parse.Object) => {

          child.set('dispOrder', this.$rootScope.targetChild.dispOrder);
          child.set('nickName', this.$rootScope.targetChild ? this.$rootScope.targetChild.nickName : null);
          child.set('birthday', this.getInputBirthday())
          child.set('gender', +this.$rootScope.targetChild.gender); /* gender is number. '+' casts string to number. */

          return child.save({
      		  error: function(child: Child, error: Parse.Error) {
      		    console.log('Error: ' + error.code + ' ' + error.message);
      		  }
      		});

        }).then(() => {

          console.log('ほぞんしました');
        });
        return;
      }

      // id付与のために現時点の最大値を取得する。
      var dispOrder: number = 0;
      var ParseChild = Parse.Object.extend('Child');
      var query = new Parse.Query(ParseChild);
  		query.descending('dispOrder');
  		query.first({
  		  success: (result: Parse.Object) => {
          if (result && result.get('dispOrder')) {
            dispOrder = result.get('dispOrder');
          }
  		  },
  		  error: function(error: Parse.Error) {
  		    alert('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then(() => {

        var child = new ParseChild();

        child.set('dispOrder', dispOrder + 1);
        child.set('nickName', this.$rootScope.targetChild ? this.$rootScope.targetChild.nickName : null);
        child.set('birthday', this.getInputBirthday())
        child.set('gender', +this.$rootScope.targetChild.gender); /* gender is number. '+' casts string to number. */

        return child.save({
    		  error: function(child: Child, error: Parse.Error) {
    		    console.log('Error: ' + error.code + ' ' + error.message);
    		  }
    		});

      }).then(() => {

        console.log('ほぞんしました');
      });

    }
  }
}
