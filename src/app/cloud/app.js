var express = require('express');
var app = express();
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.get('/hello', function (req, res) {
    res.render('hello', { message: 'Congrats, you just set up your app!' });
});
app.get('/post/:objectId', function (req, res) {
    var ParseVoice = Parse.Object.extend('Voice');
    var query = new Parse.Query(ParseVoice);
    query.descending('createdAt');
    query.include('user');
    query.equalTo('objectId', req.params.objectId);
    console.log('koko1');
    query.first()
        .then(function (result) {
        console.log('koko2');
        res.render('post', { objectId: req.params.objectId, voice: new chavoCloud.Voice(result, req.user ? req.user.get('likes') : []) });
    });
});
app.listen();
var chavoCloud;
(function (chavoCloud) {
    'use strict';
    var Voice = (function () {
        function Voice(voice, likes) {
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
            this.photoUrl = voice.get('photoUrl');
            this.isPublic = voice.getACL().getPublicReadAccess();
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
    chavoCloud.Voice = Voice;
    (function (GENDER) {
        GENDER[GENDER["MALE"] = 0] = "MALE";
        GENDER[GENDER["FEMALE"] = 1] = "FEMALE";
        GENDER[GENDER["OTHER"] = 2] = "OTHER";
    })(chavoCloud.GENDER || (chavoCloud.GENDER = {}));
    var GENDER = chavoCloud.GENDER;
})(chavoCloud || (chavoCloud = {}));
