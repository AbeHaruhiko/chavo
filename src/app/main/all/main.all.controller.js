var chavo;
(function (chavo) {
    'use strict';
    var MainAllController = (function () {
        function MainAllController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.voices = new Array();
            var Voice = Parse.Object.extend("Voice");
            var query = new Parse.Query(Voice);
            query.descending("createdAt");
            query.find({
                success: function (results) {
                    _this.$scope.$apply(function () {
                        _this.voices = results;
                    });
                },
                error: function (error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        return MainAllController;
    })();
    chavo.MainAllController = MainAllController;
})(chavo || (chavo = {}));
