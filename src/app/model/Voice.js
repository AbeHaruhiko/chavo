var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(objectId, description, speaker, age, ageYears, ageMonths, gender, genderValue, user, userObjectId, icon, like, likeCount, isPublic, createdAt) {
            this.objectId = objectId;
            this.description = description;
            this.speaker = speaker;
            this.age = age;
            this.ageYears = ageYears;
            this.ageMonths = ageMonths;
            this.gender = gender;
            this.genderValue = genderValue;
            this.user = user;
            this.userObjectId = userObjectId;
            this.icon = icon;
            this.like = like;
            this.likeCount = likeCount;
            this.isPublic = isPublic;
            this.createdAt = createdAt;
        }
        return Voice;
    })();
    chavo.Voice = Voice;
})(chavo || (chavo = {}));
