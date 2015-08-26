module chavo {
  'use strict';

  export class Voice {
    constructor(
      public objectId: string,
      public description: string,
      public speaker: string,
      public age: string,
      public gender: string,
      public user: string,
      public icon: string,
      public like: boolean,
      public createdAt: string) {
    }
  }
}
