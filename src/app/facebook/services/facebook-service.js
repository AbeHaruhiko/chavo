var chavo;
(function (chavo) {
    'use strict';
    var FacebookService = (function () {
        function FacebookService($q, $rootScope) {
            this.$q = $q;
            this.$rootScope = $rootScope;
        }
        FacebookService.prototype.api = function () {
            var _this = this;
            var dummy = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                dummy[_i - 0] = arguments[_i];
            }
            var deferred = this.$q.defer();
            var args = arguments;
            args[args.length++] = function (response) {
                if (response.error) {
                    deferred.reject(response.error);
                }
                if (response.error_msg) {
                    deferred.reject(response);
                }
                else {
                    deferred.resolve(response);
                }
                if (!_this.$rootScope.$$phase) {
                    _this.$rootScope.$apply();
                }
            };
            FB.api.apply(FB, args);
            return deferred.promise;
        };
        return FacebookService;
    })();
    chavo.FacebookService = FacebookService;
})(chavo || (chavo = {}));
