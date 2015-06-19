module chavo {
  'use strict';

  class Child {
    constructor(public nickName: string,
      public birthday: Date,
      public sex: number,
      public age?: string) {
    }
  }


  interface ISettingsChildren extends ng.IScope {
    children: Child[];
  }

  export class SettingsChildrenController {

    children = new Array<Child>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope) {

        // this.children = [
        //   { nickName: 'もも', birthDay: '2012/11/26', sex: 2},
        //   { nickName: 'あお'},
        // ];

        this.children.push(new Child('もも', moment('2012/11/26', 'YYYY/MM/DD').toDate(), 2));
        this.children.push(new Child('あお', null, null));

        this.children.forEach((child: Child) => {
          let years = moment().diff(moment(child.birthday), 'years');
          let months = moment().diff(moment(child.birthday), 'months');
          child.age = years + '歳' + months + 'ヶ月';
        });

    }


  }
}
