module chavo {
  'use strict';

  export class Voice {

    public objectId: string;
    public description: string;
    public tags: { tagName: string; }[];
    public speaker: string;
    public age: string;
    public ageYears: string;
    public ageMonths: string;
    public gender: string;
    public genderValue: GENDER;
    public user: string;
    public userObjectId: string;
    public icon: string;
    public like: boolean;
    public likeCount: number;
    public isPublic: boolean;
    public createdAt: string;

    constructor(
      private voice: Parse.Object,
      private likes: string[]
      ) {
        this.constructVoiceFromParseVoice(voice, likes);
    }

    private constructVoiceFromParseVoice(
      voice: Parse.Object,
      likes: string[]
    ) {
      this.objectId = voice.id;
      this.description = voice.get('description');
      this.tags = voice.get('tags');
      this.speaker = voice.get('author');
      this.age = this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths'));
      this.ageYears = voice.get('ageYears')
      this.ageMonths = voice.get('ageMonths');
      this.gender = voice.get('gender') === 0 ? '男の子' : voice.get('gender') === 1 ? '女の子' : '';
      this.genderValue = voice.get('gender');
      this.user = voice.get('user').get('username');
      this.userObjectId = voice.get('user').id;
      this.icon = voice.get('user').get('iconUrl') === undefined ?
          voice.get('icon') === undefined ? null : voice.get('icon').url()
              : voice.get('user').get('iconUrl');
      this.like = likes.indexOf(voice.id) >= 0 ? true : false;
      this.likeCount = voice.get('likeCount');
      this.isPublic = voice.getACL().getPublicReadAccess();
      this.createdAt = moment(voice.createdAt).format('YYYY/MM/DD').toString();
    }

    private makeAgeString(ageYears: string, ageMonths: string): string {
      if (ageYears && ageMonths) {
        return ageYears + '歳' + ageMonths + 'ヶ月';
      } else if (ageYears) {
        return ageYears + '歳';
      } else {
        return '0歳' + ageMonths + 'ヶ月';
      }
    }
  }
}
