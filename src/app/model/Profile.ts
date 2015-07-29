module chavo {
  'use strict';

  export class Profile {
    constructor(public nickname: string,
      public email: string,
      public password: string) {
    }
  }
}
