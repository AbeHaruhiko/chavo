var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(description, speaker, age, gender, user, icon, createdAt) {
            this.description = description;
            this.speaker = speaker;
            this.age = age;
            this.gender = gender;
            this.user = user;
            this.icon = icon;
            this.createdAt = createdAt;
        }
        return Voice;
    })();
    chavo.Voice = Voice;
})(chavo || (chavo = {}));
