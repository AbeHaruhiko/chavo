module chavo {
  'use strict';

  export interface IMainScope extends ng.IScope {
    voices: Voice[]
  }

  export class MainController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {


      var Voice = Parse.Object.extend('Voice');
  		var query = new Parse.Query(Voice);
  		query.descending('createdAt');
  		query.find({
  		  success: (results: Voice[]) => {
          this.$scope.$apply(() => {
            this.voices = results;
          });
  		  },
  		  error: function(error: Parse.Error) {
  		    alert('Error: ' + error.code + ' ' + error.message);
  		  }
  		});


      // this.voices = [
      //   {
      //     'description': '中華料理屋さんで。\n私「何食べたい？」\n子「ベイマックス！！！！！！！」\n私「えっ」\n\n子が指差す先を見ると・・・・酢豚の「パイナップル」（笑語呂がにてるっちゃにてるｗｗｗ',
      //     'author': 'あべさんのお子さん',
      //     'age': 2.6,
      //     'icon': 'angular.png',
      //     'createdAt': '2015-06-02'
      //   }, {
      //     'description': 'ぱぱ！！',
      //     'author': 'あべさんのお子さん',
      //     'age': 2.6,
      //     'icon': 'ic_hal.jpg',
      //     'createdAt': '2015-06-02'
      //   }
      // ];
    }
  }

}
