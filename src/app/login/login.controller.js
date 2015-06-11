var chavo;
(function (chavo) {
    'use strict';
    var LoginController = (function () {
        function LoginController($scope, $state) {
            this.$scope = $scope;
            this.$state = $state;
        }
        LoginController.prototype.logIn = function (form) {
            AuthService.logIn(form, {
                success: function (user) {
                    this.$scope.$apply(function () {
                        $scope.currentUser = user;
                        AuthService.currentUser = user;
                        if (!user.get('emailVerified')) {
                            $state.go('login');
                            return;
                        }
                        $state.go('main');
                    });
                },
                error: function (user, error) {
                    console.log("Unable to login:  " + error.code + " " + error.message);
                    $location.path('/login');
                }
            });
        };
        ;
        LoginController.prototype.logOut = function () {
            Parse.User.logOut();
        };
        return LoginController;
    })();
    chavo.LoginController = LoginController;
})(chavo || (chavo = {}));
