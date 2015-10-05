module chavo {
  'use strict';

  export class FamilyApplication {

    constructor(
        public fromUserId: string,
        public fromUserObjectId: string,
        public fromUserIconUrl: string,
        public toUserId: string,
        public toUserObjectId: string,
        public applyDateTime: Date,
        public objectId: string
      ) {
    }
  }
}
