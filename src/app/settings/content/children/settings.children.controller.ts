module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
  }

  export class SettingsChildrenController {

    children = new Array<Child>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService,
      public cfpLoadingBar: any) {

      // parseから取得
      var ParseChild = Parse.Object.extend('Child');
      var query = new Parse.Query(ParseChild);

      cfpLoadingBar.start();

  		query.ascending('dispOrder');
  		query.find({
  		  error: function(error: Parse.Error) {
  		    console.log('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then((results: Parse.Object[]) => {
        if (results.length <= 0) {
          cfpLoadingBar.complete();
          return;
        }

        results.forEach((parseChild: Parse.Object) => {

          if (parseChild.get('birthday')) {
            // 年齢
            var years: string = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
            // ヶ月（誕生日からの月数 - 年齢分の月数）
            var months: string = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));
          }

          cfpLoadingBar.complete();

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
    }

    go(child: Child) {
      child = child ? child : new Child();
      this.$rootScope.targetChild = child;
      this.$state.go('settings.child', { childId: child.dispOrder });
    }
  }
}
