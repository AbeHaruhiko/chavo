module chavo {
  'use strict';

  interface ISettingsChild extends angular.IScope {
    child: Child;
  }

  export class SettingsFamilyApprovalController {

    public familyApplicationList: FamilyApplication[] = [];

    /* @ngInject */
    constructor (
        public $scope: ISettingsChild,
        public $rootScope: IChavoRootScope,
        public $state: ng.ui.IStateService,
        public $stateParams: ng.ui.IStateParamsService,
        public cfpLoadingBar: any,
        public $q: angular.IQService,
        public $modal: any) {

      var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
      var query = new Parse.Query(ParseFamilyApplication);

      cfpLoadingBar.start();

  		query.descending('createdAt');
      // 自分宛て
      query.equalTo(Const.FamilyApplication.COL_TO_USER, Parse.User.current());
      query.include(Const.FamilyApplication.COL_FROM_USER);
  		query.find({
  		  error: function(error: Parse.Error) {
  		    console.log('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then((results: Parse.Object[]) => {
        if (results.length <= 0) {
          cfpLoadingBar.complete();
          return;
        }

        results.forEach((parseFamilyApplication: Parse.Object) => {

          cfpLoadingBar.complete();

          this.$scope.$apply(() => {
            this.familyApplicationList.push(
              new FamilyApplication(
                parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).get('username'),
                parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).id,
                parseFamilyApplication.get(Const.FamilyApplication.COL_FROM_USER).get('iconUrl'),
                parseFamilyApplication.get(Parse.User.current().get('usename')),
                parseFamilyApplication.get(Parse.User.current().id),
                parseFamilyApplication.get(Const.FamilyApplication.COL_APPLY_DATE_TIME),
                parseFamilyApplication.id
              )
            );
          });
        });
      });
    }

    // public reject(applicationObjectId: string) {
    //   var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
    //   var parseFamilyApplication = new ParseFamilyApplication();
    //   parseFamilyApplication.id = applicationObjectId;
    //   parseFamilyApplication.destroy()
    //   .then(() => {
    //     this.$state.go('settings.family_approval', { reload: true });
    //   },
    //   (error: Parse.Error) => {
    //     console.log('Error: ' + error.code + ' ' + error.message);
    //   });
    // }

    openConfirmModal(mode: string, familyApplication: FamilyApplication) {
      var modalInstance = this.$modal.open({
        animation: true,
        templateUrl: 'rejectOrApproveConfirmModal.html',
        controller: 'RejectOrApproveConfirmModalController',
        controllerAs: 'rejecrt_apprive_modal',
        size: 'sm',
        resolve: {
          mode: function() {
            return mode;
          },
          familyApplication: function() {
            return familyApplication;
          }
        }
      });

      modalInstance.result.then(() => {

        if (mode === 'reject') {
          this.destroyFamilyApproval(familyApplication);
        } else if (mode === 'approve') {
          this.doFamilyApproval(familyApplication);
        }
      }, () => {
        console.dir(familyApplication.objectId);
      });
    }

    // 否認時、かぞく申請レコードを削除する。
    // todo: たぶん消せない。他の人の作成したでーただから。
    private destroyFamilyApproval(familyApplication: FamilyApplication) {

      var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
      var parseFamilyApplication = new ParseFamilyApplication();
      parseFamilyApplication.id = familyApplication.objectId;
      parseFamilyApplication.destroy()
      .then(() => {
          this.$state.reload();
        }
      );
      console.dir(familyApplication.objectId);
    }

    // 承認時、こども情報の共有等の設定を行う。
    private doFamilyApproval(familyApplication: FamilyApplication) {
      console.dir(familyApplication.objectId);

      // todo: fromUserとParse.User.current()は同じでなきゃだめよ。
      Parse.Cloud.run('addFamily', { familyApplication: familyApplication });

    }
  }

  export class RejectOrApproveConfirmModalController {

    modeDispText: string = '';

    /* @ngInject */
    constructor (
        public $scope: IMainScope,
        public $modalInstance: any,
        public familyApplication: FamilyApplication,
        public mode: string) {

      if (mode === 'reject') {
        this.modeDispText = '否認';
      } else if (mode === 'approve') {
        this.modeDispText = '承認';
      }
    }

    process() {
        this.$modalInstance.close();
    }

    cancel() {
      this.$modalInstance.dismiss('cancel');
    }
  }
}
