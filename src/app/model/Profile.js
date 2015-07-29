var chavo;
(function (chavo) {
    'use strict';
    var Profile = (function () {
        function Profile(nickname, email, password) {
            this.nickname = nickname;
            this.email = email;
            this.password = password;
        }
        return Profile;
    })();
    chavo.Profile = Profile;
})(chavo || (chavo = {}));
