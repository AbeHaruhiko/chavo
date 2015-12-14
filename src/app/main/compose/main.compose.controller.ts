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

    // ngTagsInput用フィールド
    private ngTags: { text: string; }[] = [];

    private originalTagArray : string[] = [];

    /* @ngInject */
    constructor(
        public $scope: IMainScope,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $q: angular.IQService) {

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
            // ヶ月（誕生日からの月数 - 年齢分の月数）
            var months: string = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years) + 1);
            // 年齢
            var years: string = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
            if (months === '12') {
              months = '0';
              years = '' + (years + 1); // 一旦numberにしたり。
            }
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

      if (this.$stateParams['voice']) {
        // voiceがある場合は画面にセット（編集モード）
        this.voice = $stateParams['voice'];
        // ngTagsInputのモデルは{ text: string; }[]なので変換しておく。
        // （string[]のカラムはParse.Query.equalsToで検索できるので）
        this.ngTags = Tag.stringArrayToTagsInputObjectArray(this.voice.tags);
        this.originalTagArray = angular.copy(this.voice.tags);
        this.voiceAuthor = this.voiceAuthor || new Child();
        this.voiceAuthor.nickName = this.voice.speaker;
        this.voiceAuthor.ageYears = this.voice.ageYears;
        this.voiceAuthor.ageMonths = this.voice.ageMonths;
        this.voiceAuthor.gender = this.voice.genderValue;
        this.voiceIsPublic = this.voice.isPublic;
      }

      // ファイルインプットの設定
      var fileSelector: any = angular.element('#photo-selector');
      fileSelector.fileinput({
        dropZoneEnabled: false,
        showUpload: false,
        showCaption: false,
        showPreview: true,
        browseClass: 'photo-browse-btn btn btn-primary btn-outline',
        browseLabel: '画像選択'
      });
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

      // ngTagsInputのモデルは{ text: string; }[]なので、string[]に変換しておく。
      // （string[]のカラムはParse.Query.equalsToで検索できるので）
      this.voice.tags = Tag.tagsInputObjectArrayToStringArray(this.ngTags);

      // ファイルアップロード
      var fileSelector: any = angular.element('#photo-selector');
      if (fileSelector[0].files.length > 0) {
        // 画像が選択されている場合、保存して投稿と紐付ける。

        var file = fileSelector[0].files[0];
        var name = 'photo.jpg';

        var parseFile = new Parse.File(name, file);
        parseFile.save().then(() => {

          var parseVoice = this.makeParseVoice();
          parseVoice.set('photo', parseFile);
          parseVoice.set('photoUrl', parseFile.url());

          return parseVoice.save({
            error: function(voice: Voice, error: Parse.Error) {
              console.log('Error: ' + error.code + ' ' + error.message);
            }
          });
        }).then(() => {
          console.log('ほぞんしました');
          this.$state.go('home.all');
        }, function(error: Parse.Error) {
          console.error('投稿送信時エラー: ' + error.code + ' ' + error.message);
          this.alertMsg = '送信に失敗しました...時間をおいてためしてください。';
          this.disableInput = false;
          this.$scope.$apply();
        });
      } else {
        // 画像が選択されていない場合、投稿のみ保存

        var parseVoice = this.makeParseVoice();
        parseVoice.save({
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

      // タグを保存
      Parse.Cloud.run('saveTag', { tags: this.voice.tags });


      // タグ集計
      if (this.voice.isPublic) {
        // 一般公開のVoiceのときだけ集計
        // .TODO: 最初非公開だった場合は、後で公開しても集計されない。（タグの変更を見ているので）
        this.checkAndIncrementDailyTagCount();
      }
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

    loadTags(queryString: string) {
      // var a = [ {text: 'hoge'}, {text: 'hoo'} ];
      // return a;
      var ParseTag = Parse.Object.extend('Tag');
      var query: Parse.Query = new Parse.Query(ParseTag);

      query.select('tag');
      query.startsWith('tag', queryString);

      var tags: { text: string }[] = [];
      var deferred = this.$q.defer();
      query.find().then((results: Parse.Object[]) => {
        results.forEach((result: Parse.Object) => {
            tags.push({ text: result.get('tag') });
        });
        deferred.resolve(tags);
      }, null);

      return deferred.promise;
    }

    private makeParseVoice(): Parse.Object {

      var ParseVoice = Parse.Object.extend('Voice');
      var parseVoice = new ParseVoice();
      // 編集モードの場合、上書きする
      if (this.voice.objectId) {
        parseVoice.id = this.voice.objectId;
      }

      parseVoice.set('description', this.voice.description);
      parseVoice.set('tags', this.voice.tags);
      parseVoice.set('gender', this.voiceAuthor ? this.voiceAuthor.gender : GENDER.OTHER);
      parseVoice.set('author', this.voiceAuthor ? this.voiceAuthor.nickName : null);
      parseVoice.set('ageYears', this.voiceAuthor ? this.voiceAuthor.ageYears : null);
      parseVoice.set('ageMonths', this.voiceAuthor ? this.voiceAuthor.ageMonths : null);
      parseVoice.set('user', Parse.User.current());
      var voiceACL = new Parse.ACL(Parse.User.current());
      if (this.voiceIsPublic) {
        voiceACL.setPublicReadAccess(true);
      }
      parseVoice.setACL(voiceACL);  // 本人のRead, Write

      return parseVoice;
    }

    private checkAndIncrementDailyTagCount() {

      // 削除されたタグを調べてカウントダウン
      this.originalTagArray.forEach((originalTag: string) => {

        if (this.voice.tags.indexOf(originalTag) >= 0) {
          // 今回のVoiceのタグにもともとの（編集前の）タグが含まれている
          // 何もしない
        } else {
          // 今回のVoiceのタグにもともとの（編集前の）タグが含まれていない（編集で削除された）
          // カウントダウン

          this.incrementDailyTagCount(originalTag, -1);
        }
      });

      // 追加されたタグを調べてカウントアップ
      this.voice.tags.forEach((tag: string) => {

        if (this.originalTagArray.indexOf(tag) >= 0) {
          // 今回のVoiceのタグにもともとの（編集前の）タグが含まれている
          // 何もしない
        } else {
          // もともとのVoiceのタグに今回の（編集後の）タグが含まれていない（編集で追加された）
          // カウントアップ
          this.incrementDailyTagCount(tag, 1);
        }
      });
    }

    private incrementDailyTagCount(tag: string, amount: number) {

      var DailyTagCount = Parse.Object.extend('DailyTagCount');
      var today = moment().locale('ja').startOf('day').toDate();

      let query = new Parse.Query(DailyTagCount);
      query.equalTo('date', today);
      query.equalTo('tag', tag);
      query.first()
      .then((result: Parse.Object) => {
        let dailyTagCount = result ? result : new DailyTagCount();
        dailyTagCount.set('date', today);
        dailyTagCount.set('tag', tag);
        dailyTagCount.increment('count', amount);
        dailyTagCount.save();
      });
    }
  }

}
