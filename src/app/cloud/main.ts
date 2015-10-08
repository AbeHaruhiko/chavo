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
        console.log('saved tag: ' + parseTag.get('tag'))
      }
    });
  });

});

Parse.Cloud.define('addFamily', function(request: Parse.Cloud.FunctionRequest, response: Parse.Cloud.FunctionResponse) {

  var familyApplication: chavo.FamilyApplication = request.params.familyApplication;

  // toUserIdかfromUserIdの家族を表すRoleがあるか
  var toUser = new Parse.User();
  var fromUser = new Parse.User();

  toUser.id = request.user.id;
  fromUser.id = request.params.familyApplication.fromUserId;

  // var roleName = 'familyOf_' + request.user.id;
  var familyQuery = new Parse.Query('Family');
  var familyRole: Parse.Role;
  roleQuery.equalTo('member', request.user.id);
  roleQuery.first().then((role: Parse.Role) => {
    role.getUsers().add(fromUser);
    role.getUsers().add(toUser);
    return role.save();

  }).then(function(role: Parse.Role) {
    familyRole = role;

    var ParseChild = Parse.Object.extend('Child');
    var query = new Parse.Query(ParseChild);
    return query.find();

  }).then((children: Parse.Object[]) => {

    // 人のChildを共有するようにACLを編集するのでマスターキー使用。
    Parse.Cloud.useMasterKey();
    children.forEach((child: Parse.Object) => {

      // 現在のACLを取得
      var childACL = new Parse.ACL();
      // childACL.setReadAccess(request.user.id, true);
      // childACL.setWriteAccess(request.user.id, true);
      childACL.setRoleReadAccess(familyRole, true);
      childACL.setRoleWriteAccess(familyRole, true);
      child.setACL(childACL);
      // todo: promise化
      child.save();
    });
  });


  response.success('Success!');




  var ParseChild = Parse.Object.extend('Child');
  var query = new Parse.Query(ParseChild);
  query.find().then((children: Parse.Object[]) => {

    // 人のChildを共有するようにACLを編集するのでマスターキー使用。
    Parse.Cloud.useMasterKey();
    children.forEach((child: Parse.Object) => {

      // 現在のACLを取得
      var childACL = new Parse.ACL();
      childACL.setReadAccess(familyApplication.fromUserId, true);
      childACL.setWriteAccess(familyApplication.fromUserId, true);
      child.setACL(childACL);
      // todo: promise化
      child.save();
    });
  });
});
