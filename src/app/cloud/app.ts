
// .These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// .Global app configuration section
app.set('views', 'cloud/views');  // .Specify the folder to find templates
app.set('view engine', 'ejs');    // .Set the template engine
app.use(express.bodyParser());    // .Middleware for reading request body

// .This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req: any, res: any) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

app.get('/post/:objectId', function(req: any, res: any) {


  var ParseVoice = Parse.Object.extend('Voice');
  var query = new Parse.Query(ParseVoice);

  query.descending('createdAt');
  query.include('user');
  query.equalTo('objectId', req.params.objectId);
  console.log('koko1')

  query.first()
  .then((result: Parse.Object) => {
    console.log('koko2')

    res.render('post', { objectId: req.params.objectId, voice: new chavoCloud.Voice(result, req.user ? req.user.get('likes') : []) });
  });



});



// .Attach the Express app to Cloud Code.
app.listen();

module chavoCloud {
  'use strict';

  export class Voice {

    public objectId: string;
    public description: string;
    public tags: string[];
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
    public photoUrl: string;
    public isPublic: boolean;
    public createdAt: string;

    constructor(
      voice: Parse.Object,
      likes: string[]
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
      // this.createdAt = moment(voice.createdAt).format('YYYY/MM/DD').toString();
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

  export enum GENDER {
    MALE,
    FEMALE,
    OTHER
  }
}
