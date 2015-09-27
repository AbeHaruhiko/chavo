/// <reference path="../../../.tmp/typings/tsd.d.ts" />
Parse.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});
Parse.Cloud.define('toggleLike', function (request, response) {
    Parse.Cloud.useMasterKey();
    var voice = request.params.voice;
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
        console.log('user: ' + user);
        console.log('likes: ' + user.get('likes'));
        return parseVoice.save();
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
        response.error('Error: ' + error.code + ' ' + error.message);
    })
        .then(function (parseVoice) {
        console.log('likeCound: ' + parseVoice.get('likeCount'));
        response.success(parseVoice.get('likeCount'));
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
        response.error('Error: ' + error.code + ' ' + error.message);
    });
});
Parse.Cloud.define('saveTag', function (request, response) {
    var tags = request.params.tags;
    tags.forEach(function (tag) {
        console.log(tag);
        var ParseTag = Parse.Object.extend('Tag');
        var query = new Parse.Query(ParseTag);
        query.equalTo('tag', tag);
        query.count().then(function (count) {
            console.log('count: ' + count);
            if (count === 0) {
                var parseTag = new ParseTag();
                parseTag.set('tag', tag);
                return parseTag.save();
            }
        })
            .then(function (parseTag) {
            if (parseTag) {
                console.log('saved tag: ' + parseTag.get('tag'));
            }
        });
    });
});
