module chavo {
  'use strict';

  export class Tag {
    constructor(
        public tag: string
      ) {
    }

    public static tagsInputObjectArrayToStringArray(tagsInputObjectArray: { text: string; }[]): string[] {
      var array: string[] = [];
      tagsInputObjectArray.forEach((tagsInputObject: { text: string; }) => {
        array.push(tagsInputObject.text);
      });
      return array;
    }

    public static stringArrayToTagsInputObjectArray(tagStringArray: string[]): { text: string; }[] {
      if (!tagStringArray) {
        return [];
      }
      var tagsInputObjectArray: { text: string; }[] = [];
      tagStringArray.forEach((tag: string) => {
        tagsInputObjectArray.push({ text: tag });
      });
      return tagsInputObjectArray;
    }
  }
}
