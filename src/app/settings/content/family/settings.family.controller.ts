module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
  }

  export class SettingsFamilyController {

    familyMembers = new Array<Profile>();
    familyApps = new Array<FamilyApplication>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService,
      public cfpLoadingBar: any) {

      cfpLoadingBar.start();


      // 家族一覧取得
      Parse.Cloud.run('getRequestUsersFamilyMember')
      .then((parseFamilyList: Parse.Object[]) => {
        if (!parseFamilyList) {
          cfpLoadingBar.complete();
          return;
        }
        parseFamilyList.forEach((family: Parse.Object) => {
          this.familyMembers.push(
            new Profile(
              family.get('username'),
              null,
              null,
              family.get('iconUrl'),
              null
            )
          );
        });
        // forEachから抜けた後。
        cfpLoadingBar.complete();
      });

      // 申請中一覧
      Parse.Cloud.run('getFamilyAppFromRequestUser')
      .then((parseFamilyAppList: Parse.Object[]) => {
        console.dir(parseFamilyAppList);
        parseFamilyAppList.forEach((parseFamilyApplication: Parse.Object) => {
          this.familyApps.push(
            new FamilyApplication(
              parseFamilyApplication.get(Parse.User.current().get('usename')),
              parseFamilyApplication.get(Parse.User.current().id),
              parseFamilyApplication.get(Parse.User.current().get('iconUrl')),
              parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).get('username'),
              parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).id,
              parseFamilyApplication.get(Const.FamilyApplication.COL_TO_USER).get('iconUrl'),
              parseFamilyApplication.get(Const.FamilyApplication.COL_APPLY_DATE_TIME),
              parseFamilyApplication.id
            )
          );
        });
        console.dir(this.familyApps);
      });
    }

    go(child: Child) {
      child = child ? child : new Child();
      this.$rootScope.targetChild = child;
      this.$state.go('settings.family.apply', { childId: child.dispOrder });
    }
  }
}
