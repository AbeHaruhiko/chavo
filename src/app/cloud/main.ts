/// <reference path="../../../.tmp/typings/tsd.d.ts" />

Parse.Cloud.define('hello', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {
  response.success('Hello world!');
});

Parse.Cloud.define('toggleLike', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();
  var voice = request.params.voice;
  // ↓のトグルはローカルで実施済み
  // voice.like = !voice.like;

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
    console.log('user: ' + user);
    console.log('likes: ' + user.get('likes'));
    return parseVoice.save();
  },
  (error: Parse.Error) => {
    console.error('Error: ' + error.code + ' ' + error.message);

    response.error('Error: ' + error.code + ' ' + error.message);
  })
  .then((parseVoice: Parse.Object) => {
    console.log('likeCound: ' + parseVoice.get('likeCount'));
    response.success(parseVoice.get('likeCount'));
  },
  (error: Parse.Error) => {
    console.error('Error: ' + error.code + ' ' + error.message);

    response.error('Error: ' + error.code + ' ' + error.message);
  });

});
