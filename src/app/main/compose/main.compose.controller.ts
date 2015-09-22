module chavo {
  'use strict';

  export class MainComposeController {

    public children = new Array<Child>();
    public voiceAuthor: Child;          // ユーザ手入力用
    public genderList = [{ label: '男の子', value: GENDER.MALE },
      { label: '女の子', value: GENDER.FEMALE },
      { label: '非表示', value: GENDER.OTHER }];

    public voice: Voice;

    public voiceIsPublic: boolean = false;

    public disableInput: boolean = false;

    public alertMsg: string;

    /* @ngInject */
    constructor(
        public $scope: IMainScope,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService) {

      var ParseChild = Parse.Object.extend('Child');
      var query = new Parse.Query(ParseChild);
      query.ascending('dispOrder');
      query.find({
        error: function(error: Parse.Error) {
          console.log('Error: ' + error.code + ' ' + error.message);
        }
      }).then((results: Parse.Object[]) => {
        results.forEach((parseChild: Parse.Object) => {

          if (parseChild.get('birthday')) {
            // 年齢
            var years: string = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
            // ヶ月（誕生日からの月数 - 年齢分の月数）
            var months: string = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));
          }

          this.$scope.$apply(() => {
            this.children.push(new Child(parseChild.get('dispOrder'),
              parseChild.get('nickName'),
              parseChild.get('birthday'),
              parseChild.get('gender'),
              years ? years : null,
              months ? months : null,
              !parseChild.get('birthday')));    // 誕生日が保存されていたらunableBirthdayはfalse, 未登録ならtrueとする。
          });
        });
      });

      // voiceがある場合は画面にセット（編集モード）
      this.voice = $stateParams['voice'];
      this.voiceAuthor = this.voiceAuthor || new Child();
      this.voiceAuthor.nickName = this.voice.speaker;
      this.voiceAuthor.ageYears = this.voice.ageYears;
      this.voiceAuthor.ageMonths = this.voice.ageMonths;
      this.voiceAuthor.gender = this.voice.genderValue;
    }

    /**
     * 発言者ドロップダウンでの発言者選択時
     */
    public onSelectVoiceAuthor(child: Child): void {
      this.voiceAuthor = angular.copy(child); // ユーザ手入力用にディープコピー
    }

    public clearVoiceAuthor(): void {
      this.voiceAuthor = null;
    }

    public submit() {

      this.disableInput = true;

      var ParseVoice = Parse.Object.extend('Voice');
      var voice = new ParseVoice();
      voice.set('description', this.voice.description);
      voice.set('gender', this.voiceAuthor ? this.voiceAuthor.gender : GENDER.OTHER);
      voice.set('author', this.voiceAuthor ? this.voiceAuthor.nickName : null);
      voice.set('ageYears', this.voiceAuthor ? this.voiceAuthor.ageYears : null);
      voice.set('ageMonths', this.voiceAuthor ? this.voiceAuthor.ageMonths : null);
      voice.set('user', Parse.User.current());
      var voiceACL = new Parse.ACL(Parse.User.current());
      if (this.voiceIsPublic) {
        voiceACL.setPublicReadAccess(true);
      }
      voice.setACL(voiceACL);  // 本人のRead, Write
      voice.save({
        error: function(voice: Voice, error: Parse.Error) {
          console.log('Error: ' + error.code + ' ' + error.message);
        }
      }).then(() => {
        console.log('ほぞんしました');
        this.$state.go('home.all');
      }, (error: Parse.Error) => {
        console.error('投稿送信時エラー: ' + error.code + ' ' + error.message);
        this.alertMsg = '送信に失敗しました...時間をおいてためしてください。';
        this.disableInput = false;
        this.$scope.$apply();
      });
    }

    fetchUser() {
      Parse.User.current().fetch()
      .then((user: Parse.User) => {
        this.$rootScope.$apply(() => {
          this.$rootScope.currentUser = Parse.User.current();
        });
      },
      (error: Parse.Error) => {
        console.error('Error: ' + error.code + ' ' + error.message);
      });
    }
  }

}
