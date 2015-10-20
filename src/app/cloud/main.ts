/// <reference path='../../../.tmp/typings/tsd.d.ts' />

Parse.Cloud.define('hello', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {
  response.success('Hello world!');
});

Parse.Cloud.define('toggleLike', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  // 人のvoiceのlikceCountをincrementするのでuseMasterKey
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

Parse.Cloud.define('saveTag', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {
  var tags: string[] = request.params.tags;

  tags.forEach((tag: string) => {
    console.log(tag);
    var ParseTag = Parse.Object.extend('Tag');

    var query = new Parse.Query(ParseTag);
    query.equalTo('tag', tag);
    query.count().then((count: number) => {
      console.log('count: ' + count);
      if (count === 0) {
        var parseTag = new ParseTag();
        parseTag.set('tag', tag);
        return parseTag.save();
      }
    })
    .then((parseTag: Parse.Object) => {
      if (parseTag) {
        console.log('saved tag: ' + parseTag.get('tag'));
      }
    });
  });

});

Parse.Cloud.define('addFamily', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  // 人のChildを共有するようにACLを編集したりRoleを作ったりするのでマスターキー使用。
  Parse.Cloud.useMasterKey();

  // toUserIdかfromUserIdの家族を表すRoleがあるか
  var toUser = new Parse.User();
  var fromUser = new Parse.User();

  // 申請先ユーザ（承認者）
  toUser.id = request.user.id;
  // 申請元ユーザ（申請者）
  fromUser.id = request.params.familyApplication.fromUserObjectId;

  // 申請者、承認者のFamilyデータを検索する。
  var familyQuery = new Parse.Query('Family');
  familyQuery.containedIn('member', [ request.user, fromUser ]);

  var family: Parse.Object;
  var familyRole: Parse.Role;
  familyQuery.first()
  .then((family: Parse.Object) => {
    console.log('enter 1');
    console.log(family);

    if (!family) {
      console.log('既存familyなし');
      // 既存のFamilyがないので作る。
      var ParseFamily = Parse.Object.extend('Family');
      family = new ParseFamily();
      family.setACL(new Parse.ACL());
    }
    var relation = family.relation('member');
    relation.add(toUser);
    relation.add(fromUser);
    return family.save();

  }).then((result: Parse.Object) => {
    console.log('enter 2');
    console.log(result);

    family = result;

    // .FamilyのオブジェクトIDをnameに持つRoleを探す。
    var familyRoleQuery = new Parse.Query(Parse.Role);
    console.log(result.id);
    familyRoleQuery.equalTo('name', result.id);
    return familyRoleQuery.first();

  }).then((result: Parse.Role) => {
    console.log('enter 3');
    console.log(result);

    if (result) {
      console.log('ロールあり: name = ' + family.id + ': ' + result);
      familyRole = result;
    } else {
      // 既存Roleがなければ作る。
      familyRole = new Parse.Role(family.id, new Parse.ACL());
      console.log('ロールなし: name = ' + family.id + 'を作ります。');
    }
    console.log(familyRole.getUsers());
    familyRole.getUsers().add(toUser);
    familyRole.getUsers().add(fromUser);
    return familyRole.save();

  }).then((result: Parse.Role) => {
    console.log('enter 4');
    console.log(result);

    // 承認者と申請者のこども情報を取得
    let ParseChild = Parse.Object.extend('Child');
    let query = new Parse.Query(ParseChild);
    query.containedIn('createdBy', [ toUser, fromUser ]);
    return query.find();

  }).then((parseChildren: Parse.Object[]) => {
    console.log('parseChildren:' + parseChildren);

    var promises = [];

    parseChildren.forEach((parseChild: Parse.Object) => {
      console.log('parseChild:' + parseChild);
      var childACL = new Parse.ACL();
      childACL.setRoleReadAccess(familyRole, true);
      childACL.setRoleWriteAccess(familyRole, true);
      parseChild.setACL(childACL);
    });
    promises.push(Parse.Object.saveAll(parseChildren));
    return Parse.Promise.when(promises);

  }).then(() => {
    console.log('enter 5');

    // 全投稿を取得
    let ParseVoice = Parse.Object.extend('Voice');
    // TODO: 'user'でなく'createdBy'にしたい。

    let query = new Parse.Query(ParseVoice);
    query.containedIn('user', [ toUser, fromUser ]);
    return query.count();

  }).then((countResult: number) => {

    console.log('countResult:' + countResult);

    var promises = [];

    let ParseVoice = Parse.Object.extend('Voice');
    // TODO: 'user'でなく'createdBy'にしたい。

    let query = new Parse.Query(ParseVoice);
    query.containedIn('user', [ toUser, fromUser ]);

    for (let i = 0; i < countResult / 1000; i++) {
      query.limit(1000);
      query.skip(1000 * i);
      promises.push(query.find());
    }
    return Parse.Promise.when(promises);

  }).then((...voicesArray: Parse.Object[][]) => {

    console.log('voices:' + voicesArray);

    var promises = [];

    voicesArray.forEach((voices: Parse.Object[]) => {

      voices.forEach((voice: Parse.Object) => {
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

  }).then(() => {
    console.log('enter 6');

    response.success('Success!');
  },
  (error: Parse.Error) => {
    console.error('Error: ' + error.code + ' ' + error.message);
    response.error('Error! see log on Parse.com.');
  });
});

Parse.Cloud.define('getRequestUsersFamilyRole', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();

  var familyQuery = new Parse.Query('Family');
  familyQuery.equalTo('member', request.user);
  familyQuery.first()
  .then((result: Parse.Object) => {

      if (result) {
        var roleQuery = new Parse.Query(Parse.Role);
        roleQuery.equalTo('name', result.id);
        return roleQuery.first();
      } else {
        return Parse.Promise.as(null);
      }
  }).then((result: Parse.Role) => {
    response.success(result);
  });
});

Parse.Cloud.define('getRequestUsersFamilyMember', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();

  var familyQuery = new Parse.Query('Family');
  familyQuery.containedIn('member', [ request.user ]);
  familyQuery.first()
  .then((result: Parse.Object) => {
    console.log(result);
    if (result) {

      var query = result.relation('member').query();
      // 他ユーザに返却するのでパスワードなどは返さない。
      query.select('username', 'iconUrl');
      return query.find();

    } else {
      return;
    }

  }).then((result: Parse.Object[]) => {
    console.log(result);
    response.success(result);
  },
  (error: Parse.Error) => {
    response.error(error);
  });
});

Parse.Cloud.define('getFamilyAppToRequestUser', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();

  var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
  var query = new Parse.Query(ParseFamilyApplication);
  query.descending('createdAt');
  // 自分宛て
  query.equalTo('toUser', request.user);
  query.include('fromUser');
  query.find()
  .then((result: Parse.Object[]) => {
    response.success(result);
  },
  (error: Parse.Error) => {
    response.error(error);
  });
});

Parse.Cloud.define('getCountOfFamilyAppToRequestUser', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();

  var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
  var query = new Parse.Query(ParseFamilyApplication);
  query.descending('createdAt');
  // 自分宛て
  query.equalTo('toUser', request.user);
  query.include('fromUser');
  query.count()
  .then((count: number) => {
    response.success(count);
  },
  (error: Parse.Error) => {
    response.error(error);
  });
});

Parse.Cloud.define('getFamilyAppFromRequestUser', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  Parse.Cloud.useMasterKey();

  var ParseFamilyApplication = Parse.Object.extend('FamilyApplication');
  var query = new Parse.Query(ParseFamilyApplication);
  query.descending('createdAt');
  // 自分宛て
  query.equalTo('fromUser', request.user);
  query.include('fromUser');
  query.include('toUser');
  query.find()
  .then((result: Parse.Object[]) => {
    response.success(result);
  },
  (error: Parse.Error) => {
    response.error(error);
  });
});

var ParseImage: any = require('parse-image');

/*
 * プロフィール保存時に画像を160pxにリサイズ
 */
Parse.Cloud.beforeSave('_User', (request: Parse.Cloud.BeforeSaveRequest, response: Parse.Cloud.BeforeSaveResponse) => {

  var user = request.object;
  if (!user.get('icon')) {
    response.error('This user uses Facebook login or has not resist icon.');
    return;
  }

  if (!user.dirty('icon')) {
    // .The profile photo isn't being modified.
    response.success('');
    return;
  }

  Parse.Cloud.httpRequest({
    // _UserのbeforeSaveなので、iconUrlはまだ更新されていないのでicon.url()を使う。
    url: user.get('icon').url()

  }).then((response: Parse.Cloud.HttpResponse) => {
    var image = new ParseImage();
    return image.setData(response.buffer);

  }).then((image: any) => {
    // .Crop the image to the smaller of width or height.
    var size = Math.min(image.width(), image.height());
    return image.crop({
      left: (image.width() - size) / 2,
      top: (image.height() - size) / 2,
      width: size,
      height: size
    });

  }).then((image: any) => {
    // .Resize the image to 64x64.
    return image.scale({
      width: 160,
      height: 160
    });

  }).then((image: any) => {
    // .Make sure it's a JPEG to save disk space and bandwidth.
    return image.setFormat('JPEG');

  }).then((image: any) => {
    // .Get the image data in a Buffer.
    return image.data();

  }).then((buffer: any) => {
    // .Save the image into a new file.
    var base64 = buffer.toString('base64');
    var cropped = new Parse.File('photo.jpg', { base64: base64 });
    return cropped.save();

  }).then((cropped: any) => {
    // .Attach the image file to the original object.
    user.set('icon', cropped);
    user.set('iconUrl', cropped.url());

  }).then(() => {
    response.success('');
  }, (error: Parse.Error) => {
    console.log(9);
    response.error(error);
  });
});

/*
 * 投稿に画像を480pxにリサイズ
 */
Parse.Cloud.beforeSave('Voice', (request: Parse.Cloud.BeforeSaveRequest, response: Parse.Cloud.BeforeSaveResponse) => {

  var voice = request.object;
  if (!voice.get('photo')) {
    response.error('This user uses Facebook login or has not resist icon.');
    return;
  }

  if (!voice.dirty('photo')) {
    // .The profile photo isn't being modified.
    response.success('');
    return;
  }

  Parse.Cloud.httpRequest({
    // .VoiceのbeforeSaveなので、photoUrlはまだ更新されていないのでphoto.url()を使う。
    url: voice.get('photo').url()

  }).then((response: Parse.Cloud.HttpResponse) => {
    var image = new ParseImage();
    return image.setData(response.buffer);

  }).then((image: any) => {
    // .Resize the image to 64x64.
    var scale = 480 / Math.max(image.width(), image.height());
    return image.scale({
      width: image.width() * scale,
      height: image.height() * scale
    });

  }).then((image: any) => {
    // .Make sure it's a JPEG to save disk space and bandwidth.
    return image.setFormat('JPEG');

  }).then((image: any) => {
    // .Get the image data in a Buffer.
    return image.data();

  }).then((buffer: any) => {
    // .Save the image into a new file.
    var base64 = buffer.toString('base64');
    var cropped = new Parse.File('photo.jpg', { base64: base64 });
    return cropped.save();

  }).then((cropped: any) => {
    // .Attach the image file to the original object.
    voice.set('photo', cropped);
    voice.set('photoUrl', cropped.url());

  }).then(() => {
    response.success('');
  }, (error: Parse.Error) => {
    console.log(9);
    response.error(error);
  });
});
