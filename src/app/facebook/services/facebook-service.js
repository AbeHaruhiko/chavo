var chavo;
(function (chavo) {
    'use strict';
    var FacebookService = (function () {
        function FacebookService($q, $rootScope, AuthService, $state, $timeout) {
            this.$q = $q;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
            this.$state = $state;
            this.$timeout = $timeout;
        }
        FacebookService.prototype.api = function () {
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
            };
            FB.api.apply(FB, args);
            return deferred.promise;
        };
        FacebookService.prototype.loginWithFacebookAndGoHome = function () {
            var _this = this;
            this.AuthService.loginWithFacebook({
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    _this.$q.all([
                        _this.api('/me'),
                        _this.api('/' + user.get('authData').facebook.id + '/picture')
                    ])
                        .then(function (response) {
                        _this.$timeout(function () {
                            _this.$rootScope.currentUser.setUsername(response[0].name);
                        });
                        _this.$rootScope.$apply();
                        _this.$rootScope.currentUser.set('iconUrl', response[1].data.url);
                        _this.$rootScope.currentUser.save({
                            error: function (user, error) {
                                console.error(error.code + ':' + error.message);
                            }
                        }, null, null)
                            .then(function () {
                            _this.$state.go('home');
                        });
                    });
                },
                error: function (user, error) {
                    alert('User cancelled the Facebook login or did not fully authorize.');
                }
            });
        };
        return FacebookService;
    })();
    chavo.FacebookService = FacebookService;
})(chavo || (chavo = {}));
