module chavo {
  'use strict';

  export class FamilyApplication {

    constructor(
        public fromUserId: string,
        public fromUserObjectId: string,
        public toUserId: string,
        public toUserObjectId: string,
        public applyDateTime: Date
      ) {
    }
  }
}
