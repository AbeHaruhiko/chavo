var chavo;
(function (chavo) {
    'use strict';
    var Tag = (function () {
        function Tag(tag) {
            this.tag = tag;
        }
        return Tag;
    })();
    chavo.Tag = Tag;
})(chavo || (chavo = {}));
