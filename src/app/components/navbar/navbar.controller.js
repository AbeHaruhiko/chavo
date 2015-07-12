var chavo;
(function (chavo) {
    'use strict';
    var NavbarController = (function () {
        function NavbarController($scope, $rootScope, AuthService, $state, $location, $q, FacebookService) {
            this.$scope = $scope;
            this.$rootScope = $rootScope;
            this.AuthService = AuthService;
            this.$state = $state;
            this.$location = $location;
            this.$q = $q;
            this.FacebookService = FacebookService;
        }
        NavbarController.prototype.logIn = function (formData) {
            var _this = this;
            this.AuthService.logIn(formData, {
                success: function (user) {
                    _this.$state.go('home');
                },
                error: function (user, error) {
                    console.log('Unable to login:  ' + error.code + ' ' + error.message);
                    _this.$location.path('/login');
                }
            });
        };
        NavbarController.prototype.logOut = function () {
            this.AuthService.logOut();
        };
        NavbarController.prototype.loginWithFacebook = function () {
            var _this = this;
            this.AuthService.loginWithFacebook({
                success: function (user) {
                    _this.$rootScope.currentUser = Parse.User.current();
                    _this.$q.all([
                        _this.FacebookService.api('/me'),
                        _this.FacebookService.api('/' + user.get('authData').facebook.id + '/picture')
                    ])
                        .then(function (response) {
                        _this.$rootScope.currentUser.setUsername(response[0].name);
                        _this.$rootScope.currentUser.set('iconUrl', response[1].data.url);
                        _this.$rootScope.currentUser.save({
                            success: function (user) {
                                _this.$state.go('home');
                            }
                        }, null, null);
                    });
                },
                error: function (user, error) {
                    alert('User cancelled the Facebook login or did not fully authorize.');
                }
            });
        };
        return NavbarController;
    })();
    chavo.NavbarController = NavbarController;
})(chavo || (chavo = {}));
