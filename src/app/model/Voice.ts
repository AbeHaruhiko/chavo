module chavo {
  'use strict';

  export class Voice {
    constructor(public description: string,
      public author: string,
      public age: string,
      public gender: string,
      public user: string,
      public icon: string,
      public createdAt: string) {
    }
  }
}
