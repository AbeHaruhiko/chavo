var chavo;
(function (chavo) {
    'use strict';
    var MainMyPostsController = (function () {
        function MainMyPostsController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.voices = new Array();
            var Voice = Parse.Object.extend('Voice');
            var query = new Parse.Query(Voice);
            query.descending('createdAt');
            query.equalTo('user', Parse.User.current());
            query.find({
                success: function (results) {
                    _this.$scope.$apply(function () {
                        _this.voices = results;
                    });
                },
                error: function (error) {
                    alert('Error: ' + error.code + ' ' + error.message);
                }
            });
        }
        return MainMyPostsController;
    })();
    chavo.MainMyPostsController = MainMyPostsController;
})(chavo || (chavo = {}));
