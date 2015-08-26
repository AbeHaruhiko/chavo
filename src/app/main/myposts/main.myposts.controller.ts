module chavo {
  'use strict';

  export class MainMyPostsController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope,
        public cfpLoadingBar) {

      var ParseVoice = Parse.Object.extend('Voice');
  		var query = new Parse.Query(ParseVoice);
      var parseVoices: Parse.Object[];

      cfpLoadingBar.start();

  		query.descending('createdAt');
      query.equalTo('user', Parse.User.current());
  		query.find({
        success: (results: Parse.Object[]) => {

          // 表示用にVoiceクラスへ移し替え
          // results.forEach((voice: Parse.Object) => {
          //   /*voice.set('genderDisp', voice.get('gender') == 0 ? '男の子' : voice.get('gender') == 1 ? '女の子' : '');*/
          //   this.voices.push(new Voice(
          //     voice.get('description'),
          //     voice.get('author'),
          //     (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '',
          //     voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '',
          //     null,
          //     null,
          //     moment(voice.createdAt).format('YYYY/MM/DD').toString()
          //   ));
          // });
          //
          // this.$scope.$apply();
  		  },
  		  error: function(error: Parse.Error) {
  		    alert('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then((results: Parse.Object[]) => {
        parseVoices = results;
        var promises: Parse.Promise<any>[] = [];
        results.forEach((voice: Parse.Object) => {
          promises.push(voice.get('user').fetch());
        });
        return Parse.Promise.when(promises);
      })
      .then(() => {
        // 表示用にVoiceクラスへ移し替え
        parseVoices.forEach((voice: Parse.Object) => {
          /*voice.set('genderDisp', voice.get('gender') == 0 ? '男の子' : voice.get('gender') == 1 ? '女の子' : '');*/
          this.voices.push(new Voice(
            voice.id,
            voice.get('description'),
            voice.get('author'),
            (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '',
            voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '',
            voice.get('user').get('username'),
            voice.get('user').get('iconUrl') === undefined ?
                voice.get('icon') === undefined ? null : voice.get('icon').url()
                    : voice.get('user').get('iconUrl'),
            false,
            voice.get('likeCount'),
            moment(voice.createdAt).format('YYYY/MM/DD').toString()
          ));
        });

        cfpLoadingBar.complete();

        this.$scope.$apply();

      },
      (error: Parse.Error) => {
        // 投稿ユーザがいない場合などエラーになる

        // 表示用にVoiceクラスへ移し替え
        parseVoices.forEach((voice: Parse.Object) => {
          if (voice.get('user').get('username') !== undefined) {
            // すでにいないユーザの投稿は表示しない（mypostなのでありえないはずだが）

            this.voices.push(new Voice(
              voice.id,
              voice.get('description'),
              voice.get('author'),
              (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '',
              voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '',
              voice.get('user').get('username'),
              voice.get('user').get('iconUrl') === undefined ?
                  voice.get('icon') === undefined ? null : voice.get('icon').url()
                      : voice.get('user').get('iconUrl'),
              false,
              voice.get('likeCount'),
              moment(voice.createdAt).format('YYYY/MM/DD').toString()
            ));
          }
        });

        cfpLoadingBar.complete();

        this.$scope.$apply();
      });
    }
  }

}
