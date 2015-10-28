require('cloud/app.js');
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
            response.success('');
        });
    });
});
Parse.Cloud.define('addFamily', function (request, response) {
    Parse.Cloud.useMasterKey();
    var toUser = new Parse.User();
    var fromUser = new Parse.User();
    toUser.id = request.user.id;
    fromUser.id = request.params.familyApplication.fromUserObjectId;
    var familyQuery = new Parse.Query('Family');
    familyQuery.containedIn('member', [request.user, fromUser]);
    var family;
    var familyRole;
    familyQuery.first()
        .then(function (family) {
        console.log('enter 1');
        console.log(family);
        if (!family) {
            console.log('既存familyなし');
            var ParseFamily = Parse.Object.extend('Family');
            family = new ParseFamily();
            family.setACL(new Parse.ACL());
        }
        var relation = family.relation('member');
        relation.add(toUser);
        relation.add(fromUser);
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
    }).then(function (parseChildren) {
        console.log('parseChildren:' + parseChildren);
        var promises = [];
        parseChildren.forEach(function (parseChild) {
            console.log('parseChild:' + parseChild);
            var childACL = new Parse.ACL();
            childACL.setRoleReadAccess(familyRole, true);
            childACL.setRoleWriteAccess(familyRole, true);
            parseChild.setACL(childACL);
        });
        promises.push(Parse.Object.saveAll(parseChildren));
        return Parse.Promise.when(promises);
    }).then(function () {
        console.log('enter 5');
        var ParseVoice = Parse.Object.extend('Voice');
        var query = new Parse.Query(ParseVoice);
        query.containedIn('user', [toUser, fromUser]);
        return query.count();
    }).then(function (countResult) {
        console.log('countResult:' + countResult);
        var promises = [];
        var ParseVoice = Parse.Object.extend('Voice');
        var query = new Parse.Query(ParseVoice);
        query.containedIn('user', [toUser, fromUser]);
        for (var i = 0; i < countResult / 1000; i++) {
            query.limit(1000);
            query.skip(1000 * i);
            promises.push(query.find());
        }
        return Parse.Promise.when(promises);
    }).then(function () {
        var voicesArray = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            voicesArray[_i - 0] = arguments[_i];
        }
        console.log('voices:' + voicesArray);
        var promises = [];
        voicesArray.forEach(function (voices) {
            voices.forEach(function (voice) {
                console.log('voice:' + voice.id + ':' + familyRole.id);
                var voiceACL = new Parse.ACL();
                voiceACL.setRoleReadAccess(familyRole, true);
                voiceACL.setRoleWriteAccess(familyRole, true);
                if (voice.getACL().getPublicReadAccess()) {
                    voiceACL.setPublicReadAccess(true);
                    console.log('voice: setPublicReadAccess');
                }
                voice.setACL(voiceACL);
            });
            promises.push(Parse.Object.saveAll(voices));
            return Parse.Promise.when(promises);
        });
    }).then(function () {
        console.log('enter 6');
        response.success('Success!');
    }, function (error) {
        console.error('Error: ' + error.code + ' ' + error.message);
        response.error('Error! see log on Parse.com.');
    });
});
Parse.Cloud.define('getRequestUsersFamilyRole', function (request, response) {
    Parse.Cloud.useMasterKey();
    var familyQuery = new Parse.Query('Family');
    familyQuery.equalTo('member', request.user);
    familyQuery.first()
        .then(function (result) {
        if (result) {
            var roleQuery = new Parse.Query(Parse.Role);
            roleQuery.equalTo('name', result.id);
            return roleQuery.first();
        }
        else {
            return Parse.Promise.as(null);
        }
    }).then(function (result) {
        response.success(result);
    });
});
Parse.Cloud.define('getRequestUsersFamilyMember', function (request, response) {
    Parse.Cloud.useMasterKey();
    var familyQuery = new Parse.Query('Family');
    familyQuery.containedIn('member', [request.user]);
    familyQuery.first()
        .then(function (result) {
        console.log(result);
        if (result) {
            var query = result.relation('member').query();
            query.select('username', 'iconUrl');
            return query.find();
        }
        else {
            return;
        }
    }).then(function (result) {
        console.log(result);
        response.success(result);
    }, function (error) {
        response.error(error);
    });
});
Parse.Cloud.define('getFamilyAppToRequestUser', function (request, response) {
    Parse.Cloud.useMasterKey();
    var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
    var query = new Parse.Query(ParseFamilyApplication);
    query.descending('createdAt');
    query.equalTo('toUser', request.user);
    query.include('fromUser');
    query.find()
        .then(function (result) {
        response.success(result);
    }, function (error) {
        response.error(error);
    });
});
Parse.Cloud.define('getCountOfFamilyAppToRequestUser', function (request, response) {
    Parse.Cloud.useMasterKey();
    var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
    var query = new Parse.Query(ParseFamilyApplication);
    query.descending('createdAt');
    query.equalTo('toUser', request.user);
    query.include('fromUser');
    query.count()
        .then(function (count) {
        response.success(count);
    }, function (error) {
        response.error(error);
    });
});
Parse.Cloud.define('getFamilyAppFromRequestUser', function (request, response) {
    Parse.Cloud.useMasterKey();
    var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
    var query = new Parse.Query(ParseFamilyApplication);
    query.descending('createdAt');
    query.equalTo('fromUser', request.user);
    query.include('fromUser');
    query.include('toUser');
    query.find()
        .then(function (result) {
        response.success(result);
    }, function (error) {
        response.error(error);
    });
});
var ParseImage = require('parse-image');
Parse.Cloud.beforeSave('_User', function (request, response) {
    var user = request.object;
    if (!user.get('icon')) {
        response.success(user);
        return;
    }
    if (!user.dirty('icon')) {
        response.success(user);
        return;
    }
    Parse.Cloud.httpRequest({
        url: user.get('icon').url()
    }).then(function (response) {
        console.log(3);
        var image = new ParseImage();
        return image.setData(response.buffer);
    }).then(function (image) {
        var size = Math.min(image.width(), image.height());
        return image.crop({
            left: (image.width() - size) / 2,
            top: (image.height() - size) / 2,
            width: size,
            height: size
        });
    }).then(function (image) {
        return image.scale({
            width: 160,
            height: 160
        });
    }).then(function (image) {
        return image.setFormat('JPEG');
    }).then(function (image) {
        return image.data();
    }).then(function (buffer) {
        var base64 = buffer.toString('base64');
        var cropped = new Parse.File('photo.jpg', { base64: base64 });
        return cropped.save();
    }).then(function (cropped) {
        user.set('icon', cropped);
        user.set('iconUrl', cropped.url());
    }).then(function () {
        response.success(user);
    }, function (error) {
        console.log(9);
        response.error(error);
    });
});
Parse.Cloud.beforeSave('Voice', function (request, response) {
    var voice = request.object;
    if (!voice.get('photo')) {
        response.success(voice);
        return;
    }
    if (!voice.dirty('photo')) {
        response.success(voice);
        return;
    }
    Parse.Cloud.httpRequest({
        url: voice.get('photo').url()
    }).then(function (response) {
        console.log('before save voice: 4');
        var image = new ParseImage();
        return image.setData(response.buffer);
    }).then(function (image) {
        var scale = 480 / Math.max(image.width(), image.height());
        return image.scale({
            width: image.width() * scale,
            height: image.height() * scale
        });
    }).then(function (image) {
        return image.setFormat('JPEG');
    }).then(function (image) {
        return image.data();
    }).then(function (buffer) {
        var base64 = buffer.toString('base64');
        var cropped = new Parse.File('photo.jpg', { base64: base64 });
        return cropped.save();
    }).then(function (cropped) {
        voice.set('photo', cropped);
        voice.set('photoUrl', cropped.url());
    }).then(function () {
        response.success(voice);
    }, function (error) {
        console.log(9);
        response.error(error);
    });
});
