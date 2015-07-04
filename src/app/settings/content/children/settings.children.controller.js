var chavo;
(function (chavo) {
    'use strict';
    var SettingsChildrenController = (function () {
        function SettingsChildrenController($scope, $rootScope, $state) {
            var _this = this;
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.children = new Array();
            var ParseChild = Parse.Object.extend('Child');
            var query = new Parse.Query(ParseChild);
            query.ascending('dispOrder');
            query.find({
                error: function (error) {
                    console.log('Error: ' + error.code + ' ' + error.message);
                }
            }).then(function (results) {
                results.forEach(function (parseChild) {
                    if (parseChild.get('birthday')) {
                        var years = '' + moment().diff(moment(parseChild.get('birthday')), 'years');
                        var months = '' + (moment().diff(moment(parseChild.get('birthday')), 'months') - (12 * +years));
                    }
                    _this.$scope.$apply(function () {
                        _this.children.push(new chavo.Child(parseChild.get('dispOrder'), parseChild.get('nickName'), parseChild.get('birthday'), parseChild.get('gender'), years ? years : null, months ? months : null, !parseChild.get('birthday')));
                    });
                });
            });
        }
        SettingsChildrenController.prototype.go = function (child) {
            child = child ? child : new chavo.Child();
            this.$rootScope.targetChild = child;
            this.$state.go('settings.child', { childId: child.dispOrder });
        };
        return SettingsChildrenController;
    })();
    chavo.SettingsChildrenController = SettingsChildrenController;
})(chavo || (chavo = {}));
