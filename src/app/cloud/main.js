/// <reference path="../../../.tmp/typings/tsd.d.ts" />
Parse.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});
Parse.Cloud.define('toggleLike', function (request, response) {
    Parse.Cloud.useMasterKey();
    var voice = request.params.voice;
    voice.like = !voice.like;
    var ParseVoice = Parse.Object.extend('Voice');
    var parseVoice = new ParseVoice();
    parseVoice.id = voice.objectId;
    if (voice.like) {
        request.user.addUnique('likes', voice.objectId);
        parseVoice.increment('likeCount');
    }
    else {
        request.user.remove('likes', voice.objectId);
        parseVoice.increment('likeCount', -1);
    }
    request.user.save()
        .then(function (user) {
        console.log(user.get('likes'));
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
        response.error('Error: ' + error.code + ' ' + error.message);
    });
    parseVoice.save()
        .then(function (parseVoice) {
        console.log(parseVoice.get('likeCount'));
        response.success(parseVoice.get('likeCount'));
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
        response.error('Error: ' + error.code + ' ' + error.message);
    });
});
