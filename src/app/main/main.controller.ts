module chavo {
  'use strict';

  class Voice {
    constructor(public description: string, public author: string, public age: number, public icon: string, public createdAt: string) {
    }
  }

  interface IMainScope extends ng.IScope {
    voices: Voice[]
  }

  export class MainCtrl {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {
      var awesomes = [
        {
          'description': '中華料理屋さんで。\n私「何食べたい？」',
          'author': 'あべさんのお子さん',
          'age': 2.6,
          'icon': 'angular.png',
          'createdAt': '2015-06-02'
        },{
          'description': 'ぱぱ！！',
          'author': 'あべさんのお子さん',
          'age': 2.6,
          'icon': 'ic_hal.jpg',
          'createdAt': '2015-06-02'
        }
    ];

      awesomes.forEach((awesome: Voice) => {
        this.voices.push(awesome);
      });
    }
  }

}
