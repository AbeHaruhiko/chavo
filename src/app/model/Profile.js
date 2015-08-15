var chavo;
(function (chavo) {
    'use strict';
    var Profile = (function () {
        function Profile(username, email, password, icon) {
            this.username = username;
            this.email = email;
            this.password = password;
            this.icon = icon;
        }
        return Profile;
    })();
    chavo.Profile = Profile;
})(chavo || (chavo = {}));
