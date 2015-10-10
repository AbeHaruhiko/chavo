module chavo {
  'use strict';

  interface ISettingsChild extends ng.IScope {
    child: Child;
    yearOfToday: string;
  }

  export class SettingsChildController {

    // 生年月日の選択値
    public yearSelected: number;
    public monthSelected: number;
    public dateSelected: number;

    // 選択肢
    public birthYears: number[];
    public birthMonths: number[];
    public birthDates: number[];

    /* @ngInject */
    constructor (
        public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any) {

      console.log(this.$rootScope.targetChild);

      this.initBirthday();

      this.birthYears = new Array<number>();
      for (var i = 1900; i <= moment().year(); i++) {
        this.birthYears.push(i);
      }

      this.birthMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      this.birthDates = new Array<number>();
      for (i = 1; i <= 31; i++) {
        this.birthDates.push(i);
      }
    }

    public saveChildData() {

      this.cfpLoadingBar.start();

      if (this.$rootScope.targetChild.dispOrder > 0) {
        // 登録済みのこどもの更新の場合

        var ParseChild = Parse.Object.extend('Child');
        var query = new Parse.Query(ParseChild);
        query.equalTo('dispOrder', this.$rootScope.targetChild.dispOrder);
        query.first().then((child: Parse.Object) => {

          child.set('dispOrder', this.$rootScope.targetChild.dispOrder);
          child.set('nickName', this.$rootScope.targetChild ? this.$rootScope.targetChild.nickName : null);
          child.set('birthday', this.getInputBirthday());
          child.set('gender', +this.$rootScope.targetChild.gender); /* gender is number. '+' casts string to number. */

          return child.save({
      		  error: function(child: Child, error: Parse.Error) {
      		    console.log('Error: ' + error.code + ' ' + error.message);
      		  }
      		});

        }).then(() => {

          console.log('ほぞんしました');
          this.cfpLoadingBar.complete();
          this.$state.go('settings.children');

        });
      } else {
        // 未登録のこども情報の新規登録

        // id付与のために現時点の最大値を取得する。
        var dispOrder: number = 0;
        ParseChild = Parse.Object.extend('Child');
        query = new Parse.Query(ParseChild);
    		query.descending('dispOrder');
    		query.first({
    		  success: (result: Parse.Object) => {
            if (result && result.get('dispOrder')) {
              dispOrder = result.get('dispOrder');
            }
    		  },
    		  error: function(error: Parse.Error) {
    		    console.error('Error: ' + error.code + ' ' + error.message);
            this.cfpLoadingBar.complete();
    		  }
        }).then(() => {

          return Parse.Cloud.run('getRequestUsersFamilyRole');

        }).then((role: Parse.Role) => {

          var child = new ParseChild();

          child.set('dispOrder', dispOrder + 1);
          child.set('nickName', this.$rootScope.targetChild ? this.$rootScope.targetChild.nickName : null);
          child.set('birthday', this.getInputBirthday());
          child.set('gender', +this.$rootScope.targetChild.gender); /* gender is number. '+' casts string to number. */
          child.set('createdBy', Parse.User.current());
          if (role) {
            var childACL = new Parse.ACL();
            childACL.setRoleReadAccess(role, true);
            childACL.setRoleWriteAccess(role, true);
            child.setACL(childACL);
          } else {
            child.setACL(new Parse.ACL(Parse.User.current()));
          }

          return child.save({
      		  error: function(child: Child, error: Parse.Error) {
      		    console.log('Error: ' + error.code + ' ' + error.message);
              this.cfpLoadingBar.complete();
      		  }
      		});

        }).then(() => {

          console.log('ほぞんしました');
          this.cfpLoadingBar.complete();
          this.$state.go('settings.children');
        });
      }
    }

    public initBirthday() {
      if (this.$rootScope.targetChild.unableBirthday) {
        this.yearSelected = null;
        this.monthSelected = null;
        this.dateSelected = null;
      } else {
        this.setBirthday();
      }
    }

    private getInputBirthday(): Date {
      if (this.$rootScope.targetChild.unableBirthday) {
        return null;
      }

      return moment({ year: this.yearSelected,
          months: this.monthSelected,
          date: this.dateSelected })
        .toDate();
    }

    private setBirthday(): void {
      // 登録済みの場合はその誕生日を表示。未登録なら今日を初期値。
      var momentObj = (this.$rootScope.targetChild && this.$rootScope.targetChild.birthday
          ? moment(this.$rootScope.targetChild.birthday) : moment());
      this.yearSelected = momentObj.year();
      this.monthSelected = momentObj.month();
      this.dateSelected = momentObj.date();
    }
  }
}
