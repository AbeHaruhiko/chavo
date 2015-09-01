/// <reference path="../../../.tmp/typings/tsd.d.ts" />

Parse.Cloud.define('hello', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {
  response.success('Hello world!');
});

Parse.Cloud.afterSave('Voice', function(request: Parse.Cloud.AfterSaveRequest) {

  Parse.Cloud.useMasterKey();
  var voice: any = request.object;
  voice.like = !voice.like;

  var ParseVoice = Parse.Object.extend('Voice');
  var parseVoice = new ParseVoice();
  parseVoice.id = voice.objectId;

  if (voice.like) {
    request.user.addUnique('likes', voice.objectId);
    parseVoice.increment('likeCount');
  } else {
    request.user.remove('likes', voice.objectId);
    parseVoice.increment('likeCount', -1);
  }

  request.user.save()
  .then((user: Parse.User) => {
    console.log(user.get('likes'));
  },
  (error: Parse.Error) => {
    console.error('Error: ' + error.code + ' ' + error.message);

    response.error('Error: ' + error.code + ' ' + error.message);
  });

  parseVoice.save()
  .then((parseVoice: Parse.Object) => {
    console.log(parseVoice.get('likeCount'));
    response.success(parseVoice.get('likeCount'));
  },
  (error: Parse.Error) => {
    console.error('Error: ' + error.code + ' ' + error.message);

    response.error('Error: ' + error.code + ' ' + error.message);
  });

});
