var chavo;
(function (chavo) {
    'use strict';
    var Tag = (function () {
        function Tag(tag) {
            this.tag = tag;
        }
        Tag.tagsInputObjectArrayToStringArray = function (tagsInputObjectArray) {
            var array = [];
            tagsInputObjectArray.forEach(function (tagsInputObject) {
                array.push(tagsInputObject.text);
            });
            return array;
        };
        Tag.stringArrayToTagsInputObjectArray = function (tagStringArray) {
            if (!tagStringArray) {
                return [];
            }
            var tagsInputObjectArray = [];
            tagStringArray.forEach(function (tag) {
                tagsInputObjectArray.push({ text: tag });
            });
            return tagsInputObjectArray;
        };
        return Tag;
    })();
    chavo.Tag = Tag;
})(chavo || (chavo = {}));
