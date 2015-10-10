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
Parse.Cloud.define('addFamily', function (request, response) {
    Parse.Cloud.useMasterKey();
    var toUser = new Parse.User();
    var fromUser = new Parse.User();
    toUser.id = request.user.id;
    fromUser.id = request.params.familyApplication.fromUserObjectId;
    var toUserFamilyQuery = new Parse.Query('Family');
    toUserFamilyQuery.equalTo('member', request.user.id);
    var fromUserFamilyQuery = new Parse.Query('Family');
    fromUserFamilyQuery.equalTo('member', request.params.familyApplication.fromUserId);
    var familyQuery = Parse.Query.or(toUserFamilyQuery, fromUserFamilyQuery);
    var family;
    var familyRole;
    familyQuery.first().then(function (family) {
        console.log('enter 1');
        console.log(family);
        if (!family) {
            console.log('既存familyなし');
            var ParseFamily = Parse.Object.extend('Family');
            family = new ParseFamily();
        }
        family.addUnique('member', toUser.id);
        family.addUnique('member', fromUser.id);
        return family.save();
    }).then(function (result) {
        console.log('enter 2');
        console.log(result);
        family = result;
        var familyRoleQuery = new Parse.Query(Parse.Role);
        console.log(result.id);
        familyRoleQuery.equalTo('name', result.id);
        return familyRoleQuery.first();
    }).then(function (result) {
        console.log('enter 3');
        console.log(result);
        if (result) {
            console.log('ロールあり: name = ' + family.id + ': ' + result);
            familyRole = result;
        }
        else {
            familyRole = new Parse.Role(family.id, new Parse.ACL());
            console.log('ロールなし: name = ' + family.id + 'を作ります。');
        }
        console.log(familyRole.getUsers());
        familyRole.getUsers().add(toUser);
        familyRole.getUsers().add(fromUser);
        return familyRole.save();
    }).then(function (result) {
        console.log('enter 4');
        console.log(result);
        var ParseChild = Parse.Object.extend('Child');
        var query = new Parse.Query(ParseChild);
        query.containedIn('createdBy', [toUser, fromUser]);
        return query.find();
    }).then(function (children) {
        console.log('enter 5');
        var promises = [];
        children.forEach(function (child) {
            console.log(child.get('nickName') + ':' + familyRole.getName() + 'を追加します。');
            var childACL = new Parse.ACL();
            childACL.setRoleReadAccess(familyRole, true);
            childACL.setRoleWriteAccess(familyRole, true);
            child.setACL(childACL);
            promises.push(child.save());
        });
        return Parse.Promise.when(promises);
    }).then(function () {
        console.log('enter 6');
        response.success('Success!');
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
    });
});
