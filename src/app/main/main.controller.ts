module chavo {
  'use strict';

  class Voice {
    constructor(public description: string,
      public author: string,
      public age: number,
      public icon: string,
      public createdAt: string) {
    }
  }

  interface IMainScope extends ng.IScope {
    voices: Voice[]
  }

  export class MainController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {
      var awesomes = [
        {
          'description': '中華料理屋さんで。\n私「何食べたい？」\n子「ベイマックス！！！！！！！」\n私「えっ」\n\n子が指差す先を見ると・・・・酢豚の「パイナップル」（笑語呂がにてるっちゃにてるｗｗｗ',
          'author': 'あべさんのお子さん',
          'age': 2.6,
          'icon': 'angular.png',
          'createdAt': '2015-06-02'
        }, {
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
