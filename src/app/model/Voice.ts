module chavo {
  'use strict';

  export class Voice {
    constructor(
      public objectId: string,
      public description: string,
      public speaker: string,
      public age: string,
      public ageYears: string,
      public ageMonths: string,
      public gender: string,
      public genderValue: GENDER,
      public user: string,
      public userObjectId: string,
      public icon: string,
      public like: boolean,
      public likeCount: number,
      public isPublic: boolean,
      public createdAt: string) {
    }
  }
}
