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

    private applyFoundVoices(parseVoices: Parse.Object[]) {
      // 自分がlike済みの投稿
      var myLikes: string[] = !this.$rootScope.currentUser ? []
                                  : !this.$rootScope.currentUser.get('likes') ? []
                                  : this.$rootScope.currentUser.get('likes');
      // console.log('myLikes: ' + myLikes);

      // 表示用にVoiceクラスへ移し替え
      parseVoices.forEach((voice: Parse.Object) => {
        if (voice.get('user').get('username') !== undefined) {
          // すでにいないユーザの投稿は表示しない

          this.voice = new Voice(voice, myLikes);
        }
      });

      this.cfpLoadingBar.complete();

      this.$scope.$apply();
    }
  }
}
