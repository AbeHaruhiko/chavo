var chavo;
(function (chavo) {
    'use strict';
    (function (GENDER) {
        GENDER[GENDER["MALE"] = 0] = "MALE";
        GENDER[GENDER["FEMALE"] = 1] = "FEMALE";
        GENDER[GENDER["OTHER"] = 2] = "OTHER";
    })(chavo.GENDER || (chavo.GENDER = {}));
    var GENDER = chavo.GENDER;
})(chavo || (chavo = {}));
