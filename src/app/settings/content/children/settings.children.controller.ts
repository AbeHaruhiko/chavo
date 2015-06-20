module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
    children: Child[];
  }

  export class SettingsChildrenController {

    children = new Array<Child>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService) {

        // this.children = [
        //   { nickName: 'もも', birthDay: '2012/11/26', sex: 2},
        //   { nickName: 'あお'},
        // ];

        this.children.push(new Child(1, 'もも', moment('2012/11/26', 'YYYY/MM/DD').toDate(), 2));
        this.children.push(new Child(2, 'あお', null, null));

        // 月齢のセット
        this.children.forEach((child: Child) => {
          // 年齢
          var years = moment().diff(moment(child.birthday), 'years');
          // ヶ月（誕生日からの月数 - 年齢分の月数）
          var months = moment().diff(moment(child.birthday), 'months') - (12 * years);
          child.age = (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '');
        });

    }

    go(child: Child) {
      this.$rootScope.targetChild = child;
      this.$state.go('settings.child', { childId: child.id });
    }

  }
}
