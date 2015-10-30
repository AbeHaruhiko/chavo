module chavo {
  'use strict';

  export class MainTagController {

    voices = new Array<Voice>();
    pageCount = 0;
    loading = false;

    sampleTagList: string[] = [
      'おもしろ',
      '迷言',
      '名言',
      '一発ネタ',
      '謎ワード',
      '感動',
      '成長したなあ。',
      '苦笑',
      'ほのぼの'
    ];

    popularTagList: { tag: string; count: number; }[] = [];

    /* @ngInject */
    constructor (
        public $scope: IMainScope,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $modal: any) {

      // this.initPopularTags();
      this.init();
    }

    initPopularTags() {

      var DailyTagCount = Parse.Object.extend('DailyTagCount');
      var query = new Parse.Query(DailyTagCount);
      // 一週間分
      query.greaterThanOrEqualTo('date', moment().locale('ja').subtract(1, 'week').toDate());
      query.ascending('tag');
      query.find()
      .then((results: Parse.Object[]) => {
        // .MapクラスはTypeScript1.5にまだないらしい。
        let tagCountMap: { [key: string]: number; } = {};
        results.forEach((dailyTagCount: Parse.Object) => {
          // タグごとにサマリー
          let currentSum = tagCountMap[dailyTagCount.get('tag')] ? tagCountMap[dailyTagCount.get('tag')] : 0;
          tagCountMap[dailyTagCount.get('tag')] = currentSum + dailyTagCount.get('count');
        });

        // 配列にしてソート
        let popularTagList: { tag: string; count: number; }[] = [];
        for (var tag in tagCountMap) {  // for inはオブジェクトのプロパティを列挙してくれる。Object.keysで配列ゲットでもできる。
          popularTagList.push({ tag: tag, count: tagCountMap[tag] });
        }
        popularTagList.sort(function(a: any, b: any) {
          return a.count > b.count ? 1 : -1;
        });

        console.log(popularTagList);
        this.$scope.$apply();

      });
    }

    init() {
      this.cfpLoadingBar.start();

      this.loading = true;

      var parseVoices: Parse.Object[];

      var DailyTagCount = Parse.Object.extend('DailyTagCount');
      var query = new Parse.Query(DailyTagCount);
      // 一週間分
      query.greaterThanOrEqualTo('date', moment().locale('ja').subtract(1, 'week').toDate());
      query.ascending('tag');
      query.find()
      .then((results: Parse.Object[]) => {
        // .MapクラスはTypeScript1.5にまだないらしい。
        let tagCountMap: { [key: string]: number; } = {};
        results.forEach((dailyTagCount: Parse.Object) => {
          // タグごとにサマリー
          let currentSum = tagCountMap[dailyTagCount.get('tag')] ? tagCountMap[dailyTagCount.get('tag')] : 0;
          tagCountMap[dailyTagCount.get('tag')] = currentSum + dailyTagCount.get('count');
        });

        // 配列にして降順にソート
        for (var tag in tagCountMap) {  // for inはオブジェクトのプロパティを列挙してくれる。Object.keysで配列ゲットでもできる。
          this.popularTagList.push({ tag: tag, count: tagCountMap[tag] });
        }
        this.popularTagList.sort(function(a: any, b: any) {
          return a.count < b.count ? 1 : -1;
        });

        console.log(this.popularTagList);

      })
      .then(() => {

        var ParseVoice = Parse.Object.extend('Voice');
        var query = new Parse.Query(ParseVoice);

        query.descending('createdAt');
        query.equalTo('tags', this.$stateParams['tag']);
        query.limit(5);
        query.skip(5 * this.pageCount);

        return query.find();
      })
      .then((results: Parse.Object[]) => {
        // 投稿者のアイコンを取得するため、fetchする。

        parseVoices = results;
        var promises: Parse.Promise<any>[] = [];
        results.forEach((voice: Parse.Object) => {
          promises.push(voice.get('user').fetch());
        });

        if (Parse.User.current()) {
          // ユーザをfetchして最新のlikesを取得しておく
          promises.push(Parse.User.current().fetch());
        }

        return Parse.Promise.when(promises);
      })
      .then(() => {
        this.applyFoundVoices(parseVoices);
      },
      (error: any) => {
        // 投稿ユーザがいない場合などエラーになる
        console.error(error);
        this.applyFoundVoices(parseVoices);
      });

      // // 人気のタグ取得
      // var ParaseTag
      // var ParaseTag = Parse.Object.extend('Tag');
      // var queryForTag = new Prase.Query(ParseTag);
      // query.select('tag');
      //
      //
      // var queryForPopularTag = new Parse.Query(ParseVoice);
      // var parseVoices: Parse.Object[];
      //
      // this.cfpLoadingBar.start();
      //
      // queryForPopularTag.limit(20);
      // queryForPopularTag.select('tag');
      //
      // query.equalTo('tags', this.$stateParams['tag']);
      //
      // query.find({

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

    loadMore() {
      if (this.loading) {
        return;
      }
      this.pageCount++;
      this.init();
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

          this.voices.push(new Voice(voice, myLikes));
        }
      });

      this.cfpLoadingBar.complete();

      this.$scope.$apply();

      this.loading = false;
    }
  }
}
