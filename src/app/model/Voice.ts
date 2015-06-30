module chavo {
  'use strict';

  export class Voice {
    constructor(public description: string,
      public author: string,
      public age: number,
      public icon: string,
      public createdAt: string) {
    }
  }
}
