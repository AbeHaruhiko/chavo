module chavo {
  'use strict';

  export class MainPostController {

    voice: Voice;

    /* @ngInject */
    constructor (
        public $scope: IMainScope,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $modal: any) {

      this.init();
    }

    init() {
      if (this.$stateParams['voice']) {
        // voiceがある場合は画面にセット
        this.voice = this.$stateParams['voice'];
      } else {

        var ParseVoice = Parse.Object.extend('Voice');
        var query = new Parse.Query(ParseVoice);
        var parseVoice: Parse.Object;

        this.cfpLoadingBar.start();

        query.descending('createdAt');
        query.include('user');
        query.equalTo('objectId', this.$stateParams['voiceId']);

        query.first()
        .then((result: Parse.Object) => {

          parseVoice = result;

          if (Parse.User.current()) {
            // ユーザをfetchして最新のlikesを取得しておく
            return Parse.User.current().fetch();
          } else {
            return Parse.Promise.as('');
          }
        })
        .then(() => {
          this.applyFoundVoices(parseVoice);
        },
        (error: any) => {
          // 投稿ユーザがいない場合などエラーになる
          console.error(error);
          this.applyFoundVoices(parseVoice);
        });
      }
    }

    toggleLike(voice: Voice) {

      // cloud Codeへ移動

      voice.like = !voice.like;

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
      });
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

        // console.info('1: Modal dismissed at: ' + new Date());
        console.dir(voice);
      }, () => {
        // console.info('2: Modal dismissed at: ' + new Date());
        console.dir(voice);
      });
    }

    private applyFoundVoices(parseVoice: Parse.Object) {
      // 自分がlike済みの投稿
      var myLikes: string[] = !this.$rootScope.currentUser ? []
                                  : !this.$rootScope.currentUser.get('likes') ? []
                                  : this.$rootScope.currentUser.get('likes');
      // console.log('myLikes: ' + myLikes);

      // 表示用にVoiceクラスへ移し替え
      if (parseVoice.get('user').get('username') !== undefined) {
        // すでにいないユーザの投稿は表示しない

        this.voice = new Voice(parseVoice, myLikes);
      }

      this.cfpLoadingBar.complete();

      this.$scope.$apply();
    }
  }
}
