var chavo;
(function (chavo) {
    'use strict';
    var Voice = (function () {
        function Voice(voice, likes) {
            this.voice = voice;
            this.likes = likes;
            this.constructVoiceFromParseVoice(voice, likes);
        }
        Voice.prototype.constructVoiceFromParseVoice = function (voice, likes) {
            this.objectId = voice.id;
            this.description = voice.get('description');
            this.tags = voice.get('tags');
            this.speaker = voice.get('author');
            this.age = this.makeAgeString(voice.get('ageYears'), voice.get('ageMonths'));
            this.ageYears = voice.get('ageYears');
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
        };
        Voice.prototype.makeAgeString = function (ageYears, ageMonths) {
            if (ageYears && ageMonths) {
                return ageYears + '歳' + ageMonths + 'ヶ月';
            }
            else if (ageYears) {
                return ageYears + '歳';
            }
            else {
                return '0歳' + ageMonths + 'ヶ月';
            }
        };
        return Voice;
    })();
    chavo.Voice = Voice;
})(chavo || (chavo = {}));
