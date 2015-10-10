var chavo;
(function (chavo) {
    'use strict';
    var Child = (function () {
        function Child(dispOrder, nickName, birthday, gender, ageYears, ageMonths, unableBirthday, createdBy) {
            if (dispOrder === void 0) { dispOrder = 0; }
            if (nickName === void 0) { nickName = null; }
            if (birthday === void 0) { birthday = null; }
            if (gender === void 0) { gender = chavo.GENDER.OTHER; }
            if (ageYears === void 0) { ageYears = null; }
            if (ageMonths === void 0) { ageMonths = null; }
            if (unableBirthday === void 0) { unableBirthday = true; }
            if (createdBy === void 0) { createdBy = null; }
            this.dispOrder = dispOrder;
            this.nickName = nickName;
            this.birthday = birthday;
            this.gender = gender;
            this.ageYears = ageYears;
            this.ageMonths = ageMonths;
            this.unableBirthday = unableBirthday;
            this.createdBy = createdBy;
        }
        return Child;
    })();
    chavo.Child = Child;
})(chavo || (chavo = {}));
