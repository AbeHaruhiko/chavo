module chavo {
  'use strict';

  export class Child {
    constructor(public dispOrder: number = 0,
        public nickName: string = null,
        public birthday: Date = null,
        public gender: GENDER = GENDER.OTHER,
        public ageYears: string = null,
        public ageMonths: string = null,
        public unableBirthday: boolean = true) {
    }
  }
}
