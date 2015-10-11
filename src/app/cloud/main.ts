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
  var toUserFamilyQuery = new Parse.Query('Family');
  toUserFamilyQuery.equalTo('member', request.user);

  var fromUserFamilyQuery = new Parse.Query('Family');
  fromUserFamilyQuery.equalTo('member', fromUser);

 // orでクエリを作る。
  var familyQuery = Parse.Query.or(toUserFamilyQuery, fromUserFamilyQuery);
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
    var ParseChild = Parse.Object.extend('Child');
    var query = new Parse.Query(ParseChild);
    query.containedIn('createdBy', [ toUser, fromUser ]);
    return query.find();

  }).then((children: Parse.Object[]) => {
    console.log('enter 5');

    // 各こどものACLを家族Roleに置き換え。
    var promises = [];
    children.forEach((child: Parse.Object) => {

      console.log(child.get('nickName') + ':' + familyRole.getName() + 'を追加します。');

      var childACL = new Parse.ACL();
      childACL.setRoleReadAccess(familyRole, true);
      childACL.setRoleWriteAccess(familyRole, true);
      child.setACL(childACL);

      promises.push(child.save());
    });
    return Parse.Promise.when(promises);

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
  familyQuery.equalTo('member', request.user);
  familyQuery.first()
  .then((result: Parse.Object) => {
    console.log(result);
    var query = result.relation('member').query();
    // 他ユーザに返却するのでパスワードなどは返さない。
    query.select('username', 'iconUrl');
    return query.find();
  }).then((result: Parse.Object[]) => {
    console.log(result);
    response.success(result);
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
