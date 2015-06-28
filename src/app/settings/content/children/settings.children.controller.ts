module chavo {
  'use strict';

  interface ISettingsChildren extends ng.IScope {
  }

  export class SettingsChildrenController {

    children = new Array<Child>();

    /* @ngInject */
    constructor (public $scope: ISettingsChildren,
      public $rootScope: IChavoRootScope,
      public $state: ng.ui.IStateService) {

      // parseから取得
      var ParseChild = Parse.Object.extend('Child');
      var query = new Parse.Query(ParseChild);
  		query.ascending('dispOrder');
  		query.find({
  		  error: function(error: Parse.Error) {
  		    console.log('Error: ' + error.code + ' ' + error.message);
  		  }
  		}).then((results: Parse.Object[]) => {
        results.forEach((parseChild: Parse.Object) => {

          // 年齢
          var years: string = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
          // ヶ月（誕生日からの月数 - 年齢分の月数）
          var months: string = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));

          this.$scope.$apply(() => {
            this.children.push(new Child(parseChild.get('dispOrder'),
                parseChild.get('nickName'),
                parseChild.get('birthday'),
                parseChild.get('gender'),
                years ? years : null,
                months ? months : null));
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
