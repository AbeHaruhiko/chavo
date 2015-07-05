var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(description, author, age, gender, icon, createdAt) {
            this.description = description;
            this.author = author;
            this.age = age;
            this.gender = gender;
            this.icon = icon;
            this.createdAt = createdAt;
        }
        return Voice;
    })();
    chavo.Voice = Voice;
})(chavo || (chavo = {}));
