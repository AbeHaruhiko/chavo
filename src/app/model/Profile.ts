module chavo {
  'use strict';

  export class Profile {
    constructor(public username: string,
      public email: string,
      public password: string,
      public icon: string) {
    }
  }
}
