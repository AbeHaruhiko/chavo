module chavo {
  'use strict';

  export class MainAllController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (
        public $scope: IMainScope,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public cfpLoadingBar: any,
        public $modal: any) {

      this.init();
    }

    init() {
      var ParseVoice = Parse.Object.extend('Voice');
      var query = new Parse.Query(ParseVoice);
      var parseVoices: Parse.Object[];

      this.cfpLoadingBar.start();

      query.descending('createdAt');

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
          console.error('Error: ' + error.code + ' ' + error.message);
        }
      }).then((results: Parse.Object[]) => {
        // 投稿者のアイコンを取得するため、fetchする。

        parseVoices = results;
        var promises: Parse.Promise<any>[] = [];
        results.forEach((voice: Parse.Object) => {
          promises.push(voice.get('user').fetch());
        });

        if (Parse.User.current()) {
          // 最新のlikesを取得しておく
          promises.push(Parse.User.current().fetch());
        }

        return Parse.Promise.when(promises);
      })
      .then(() => {


        // 表示用にVoiceクラスへ移し替え
        parseVoices.forEach((voice: Parse.Object) => {

          // 自分がlike済みの投稿
          // $rootScope.currentUser = Parse.User.current();
          var myLikes: string[] = !this.$rootScope.currentUser ? []
                                      : !this.$rootScope.currentUser.get('likes') ? []
                                      : this.$rootScope.currentUser.get('likes');
          console.log('myLikes: ' + myLikes);

          this.voices.push(new Voice(
            voice.id,
            voice.get('description'),
            voice.get('author'),
            this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths')),
            voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '',
            voice.get('user').get('username'),
            voice.get('user').id,
            voice.get('user').get('iconUrl') === undefined ?
                voice.get('icon') === undefined ? null : voice.get('icon').url()
                    : voice.get('user').get('iconUrl'),
            myLikes.indexOf(voice.id) >= 0 ? true : false,
            voice.get('likeCount'),
            moment(voice.createdAt).format('YYYY/MM/DD').toString()
          ));
        });

        this.cfpLoadingBar.complete();

        this.$scope.$apply();

      },
      (error: any) => {
        console.error(error);
        // 投稿ユーザがいない場合などエラーになる

        // 自分がlike済みの投稿
        var myLikes: string[] = !this.$rootScope.currentUser ? []
                                    : !this.$rootScope.currentUser.get('likes') ? []
                                    : this.$rootScope.currentUser.get('likes');
        console.log('myLikes: ' + myLikes);

        // 表示用にVoiceクラスへ移し替え
        parseVoices.forEach((voice: Parse.Object) => {
          if (voice.get('user').get('username') !== undefined) {
            // すでにいないユーザの投稿は表示しない

            this.voices.push(new Voice(
              voice.id,
              voice.get('description'),
              voice.get('author'),
              this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths')),
              voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '',
              voice.get('user').get('username'),
              voice.get('user').id,
              voice.get('user').get('iconUrl') === undefined ?
                  voice.get('icon') === undefined ? null : voice.get('icon').url()
                      : voice.get('user').get('iconUrl'),
              myLikes.indexOf(voice.id) >= 0 ? true : false,
              voice.get('likeCount'),
              moment(voice.createdAt).format('YYYY/MM/DD').toString()
            ));
          }
        });

        this.cfpLoadingBar.complete();

        this.$scope.$apply();
      });

    }

    toggleLike(voice: Voice) {

      // cloud Codeへ移動

      voice.like = !voice.like;

      // var ParseVoice = Parse.Object.extend('Voice');
      // var parseVoice: Parse.Object = new ParseVoice();
      // parseVoice.id = voice.objectId;
      //
      // if (voice.like) {
      //   parseVoice.increment('likeCount');
      // } else {
      //   parseVoice.increment('likeCount', -1);
      // }
      //
      // parseVoice.save()
      // .then((parseVoice: Parse.Object) => {
      //   console.log(parseVoice.get('likeCount'));
      //   this.$scope.$apply(() => {
      //     voice.likeCount = parseVoice.get('likeCount');
      //   });
      // },
      // (error: Parse.Error) => {
      //   console.error('Error: ' + error.code + ' ' + error.message);
      // });
      //
      Parse.Cloud.run('toggleLike', { voice: voice })
      .then((likeCount: number) => {
        this.$scope.$apply(() => {
          voice.likeCount = likeCount;

          // // CloudCodeでユーザにlikesを追加しているのでフェッチ
          // return Parse.User.current().fetch();
        });
      },
      (error: Parse.Error) => {
        console.error('Error: ' + error.code + ' ' + error.message);
      })
      // .then((user: Parse.User) => {
      //   this.$rootScope.currentUser = Parse.User.current();
      // },
      // (error: Parse.Error) => {
      //   console.error('Error: ' + error.code + ' ' + error.message);
      // })
      ;
    }

    openDeletePostConfirmModal(voice: Voice) {
      var modalInstance = this.$modal.open({
        animation: true,
        templateUrl: 'deletePostConfirmModal.html',
        controller: 'DeletePostConfirmModalController',
        controllerAs: 'delete_post_modal',
        size: 'sm',
        resolve: {
          voice: function () {
            return voice;
          }
        }
      });

      modalInstance.result.then((voice: Voice) => {
        // todo: ここで削除処理
        var ParseVoice = Parse.Object.extend('Voice');
        var parseVoice = new ParseVoice();
        parseVoice.id = voice.objectId;
        parseVoice.destroy()
        .then(() => {
            this.$state.reload();
          }
        );

        console.info('1: Modal dismissed at: ' + new Date());
        console.dir(voice);
      }, () => {
        console.info('2: Modal dismissed at: ' + new Date());
        console.dir(voice);
      });
    }

    private makeAgeString(ageYears: string, ageMonths: string): string {
      if (ageYears && ageMonths) {
        return ageYears + '歳' + ageMonths + 'ヶ月';
      } else if (ageYears) {
        return ageYears + '歳';
      } else {
        return '0歳' + ageMonths + 'ヶ月';
      }
    }
  }
}
