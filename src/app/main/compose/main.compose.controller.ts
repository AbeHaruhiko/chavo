module chavo {
  'use strict';

  export class MainComposeController {

    public children = new Array<Child>();
    public wordsAuthor: Child;
    public genderList = [ { label: '男の子', value: GENDER.MALE },
        { label: '女の子', value: GENDER.FEMALE },
        { label: 'その他・表示しない', value: GENDER.OTHER } ];

    /* @ngInject */
    constructor (public $scope: IMainScope) {

      //
      this.children.push(new Child(0, '指定しない', null, null, null));

      var ParseChild = Parse.Object.extend('Child');
      var query = new Parse.Query(ParseChild);
  		query.ascending('dispOrder');
  		query.find({
  		  error: function(error: Parse.Error) {
  		    console.log('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then((results: Parse.Object[]) => {
        results.forEach((parseChild: Parse.Object) => {

          // 年齢
          var years = moment().diff(moment(parseChild.get('birthday')), 'years');
          // ヶ月（誕生日からの月数 - 年齢分の月数）
          var months = moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * years);

          this.children.push(new Child(parseChild.get('dispOrder'),
              parseChild.get('nickName'),
              parseChild.get('birthday'),
              parseChild.get('gender'),
              (years ? (years + '歳') : '') + (months ? (months + 'ヶ月') : '')));
        });
      });
    }
  }

}
