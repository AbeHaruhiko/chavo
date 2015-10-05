module chavo {
  'use strict';

  interface ISettingsChild extends angular.IScope {
    child: Child;
    yearOfToday: string;
  }

  export class SettingsFamilyApplicationController {

    // ngTagsInput用フィールド
    private ngTags: { text: string; iconUrl: string; objectId: string; }[] = [];

    /* @ngInject */
    constructor (
        public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $q: angular.IQService) {

      console.log(this.$rootScope.targetChild);

    }

    public apply() {

      let ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
      let query = new Parse.Query(ParseFamilyApplication);
      query.equalTo(Const.FamilyApplication.COL_FROM_USER, Parse.User.current());
      // objectIdでなくユーザーIDでの検索なので、ユーザーIDが変わった時などただしいユーザーを取得できない可能性あり
      var toUser = new Parse.User();
      toUser.id = this.ngTags[0].objectId;
      query.equalTo(Const.FamilyApplication.COL_TO_USER, toUser);
      query.first().then((application: FamilyApplication) => {
        if (application) {
          // すでに同じユーザへ申請済み
        } else {
          // 今回が初申請
          let familyApplication = new ParseFamilyApplication();
          // var voiceACL = new Parse.ACL(Parse.User.current());
          // voiceACL.

          familyApplication.set(Const.FamilyApplication.COL_FROM_USER, Parse.User.current());
          familyApplication.set(Const.FamilyApplication.COL_TO_USER, toUser);
          familyApplication.save();
        }
      });
    }

    loadUser(queryString: string) {

      var query: Parse.Query = new Parse.Query(Parse.User);

      query.select('username', 'iconUrl');
      query.startsWith('username', queryString);

      var users: { text: string; iconUrl: string; objectId: string; }[] = [];
      var deferred = this.$q.defer();
      query.find().then((results: Parse.Object[]) => {
        results.forEach((result: Parse.Object) => {
            users.push({ text: result.get('username'), iconUrl: result.get('iconUrl'), objectId: result.id });
        });
        deferred.resolve(users);
      }, null);

      return deferred.promise;
    }
  }
}
