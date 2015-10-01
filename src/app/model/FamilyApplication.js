var chavo;
(function (chavo) {
    'use strict';
    var FamilyApplication = (function () {
        function FamilyApplication(fromUserId, fromUserObjectId, toUserId, toUserObjectId, applyDateTime) {
            this.fromUserId = fromUserId;
            this.fromUserObjectId = fromUserObjectId;
            this.toUserId = toUserId;
            this.toUserObjectId = toUserObjectId;
            this.applyDateTime = applyDateTime;
        }
        return FamilyApplication;
    })();
    chavo.FamilyApplication = FamilyApplication;
})(chavo || (chavo = {}));
