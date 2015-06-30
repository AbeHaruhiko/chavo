module chavo {
  'use strict';

  export class MainComposeController {

    public children = new Array<Child>();
    public voiceAuthorSelected: Child;  // ドロップダウン表示用
    public voiceAuthor: Child;          // ユーザ手入力用
    public genderList = [ { label: '男の子', value: GENDER.MALE },
        { label: '女の子', value: GENDER.FEMALE },
        { label: '非表示', value: GENDER.OTHER } ];

    public voice: Voice;

    /* @ngInject */
    constructor (public $scope: IMainScope) {

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
          var years: string = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
          // ヶ月（誕生日からの月数 - 年齢分の月数）
          var months: string = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));

          this.$scope.$apply(() => {
            this.children.push(new Child(parseChild.get('dispOrder'),
                parseChild.get('nickName'),
                parseChild.get('birthday'),
                parseChild.get('gender'),
                years ? years : null,
                months ? months : null));
          });
        });
      });
    }

    /**
    * 発言者ドロップダウンでの発言者選択時
    */
    public onSelectVoiceAuthor(child: Child): void {
      this.voiceAuthorSelected = child; // ドロップダウン表示用
      this.voiceAuthor = angular.copy(child); // ユーザ手入力用にディープコピー
    }

    public submit() {

      var ParseVoice = Parse.Object.extend('Voice');
      var voice = new ParseVoice();
      voice.set('description', this.voice.description);
      voice.save();
    }
  }

}
