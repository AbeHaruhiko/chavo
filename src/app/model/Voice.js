var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(objectId, description, speaker, age, gender, user, userObjectId, icon, like, likeCount, createdAt) {
            this.objectId = objectId;
            this.description = description;
            this.speaker = speaker;
            this.age = age;
            this.gender = gender;
            this.user = user;
            this.userObjectId = userObjectId;
            this.icon = icon;
            this.like = like;
            this.likeCount = likeCount;
            this.createdAt = createdAt;
        }
        return Voice;
    })();
    chavo.Voice = Voice;
})(chavo || (chavo = {}));
