var chavo;
(function (chavo) {
    'use strict';
    var FamilyApplication = (function () {
        function FamilyApplication(fromUserId, fromUserObjectId, fromUserIconUrl, toUserId, toUserObjectId, applyDateTime, objectId) {
            this.fromUserId = fromUserId;
            this.fromUserObjectId = fromUserObjectId;
            this.fromUserIconUrl = fromUserIconUrl;
            this.toUserId = toUserId;
            this.toUserObjectId = toUserObjectId;
            this.applyDateTime = applyDateTime;
            this.objectId = objectId;
        }
        return FamilyApplication;
    })();
    chavo.FamilyApplication = FamilyApplication;
})(chavo || (chavo = {}));
