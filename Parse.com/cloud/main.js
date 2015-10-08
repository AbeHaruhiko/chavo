/// <reference path="../../../.tmp/typings/tsd.d.ts" />
Parse.Cloud.define('hello', function (request, response) {
    response.success('Hello world!');
});
Parse.Cloud.define('toggleLike', function (request, response) {
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
    var familyApplication = request.params.familyApplication;
    var ParseChild = Parse.Object.extend('Child');
    var query = new Parse.Query(ParseChild);
    query.find().then(function (children) {
        // 人のChildを共有するようにACLを編集するのでマスターキー使用。
        Parse.Cloud.useMasterKey();
        children.forEach(function (child) {
            var childACL = new Parse.ACL(familyApplication.fromUserId);
            childACL.setReadAccess(familyApplication.fromUserId, true);
            childACL.setWriteAccess(familyApplication.fromUserId, true);
            child.setACL(childACL);
            // todo: promise化
            child.save();
        });
    });
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsb3VkL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsdURBQXVEO0FBRXZELEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFTLE9BQW9DLEVBQUUsUUFBc0M7SUFDL0csUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxVQUFTLE9BQW9DLEVBQUUsUUFBc0M7SUFFcEgsK0NBQStDO0lBQy9DLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakMsa0JBQWtCO0lBQ2xCLDRCQUE0QjtJQUU1QixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxJQUFJLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO0lBQ2xDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUUvQixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLFVBQVUsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1NBQ2xCLElBQUksQ0FBQyxVQUFDLElBQWdCO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUMsRUFDRCxVQUFDLEtBQWtCO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1RCxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDO1NBQ0QsSUFBSSxDQUFDLFVBQUMsVUFBd0I7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUMsRUFDRCxVQUFDLEtBQWtCO1FBQ2pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU1RCxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxVQUFTLE9BQW9DLEVBQUUsUUFBc0M7SUFDakgsSUFBSSxJQUFJLEdBQWEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFFekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQVc7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQyxJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUIsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFDLEtBQWE7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQzlCLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3pCLENBQUM7UUFDSCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsVUFBQyxRQUFzQjtZQUMzQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtZQUNsRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0FBRUgsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFVBQVMsT0FBb0MsRUFBRSxRQUFzQztJQUVuSCxJQUFJLGlCQUFpQixHQUE0QixPQUFPLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBRWxGLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsUUFBd0I7UUFFekMscUNBQXFDO1FBQ3JDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDM0IsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQW1CO1lBQ25DLElBQUksUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMzRCxRQUFRLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM1RCxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLGlCQUFpQjtZQUNqQixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoiY2xvdWQvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8udG1wL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxuXG5QYXJzZS5DbG91ZC5kZWZpbmUoJ2hlbGxvJywgZnVuY3Rpb24ocmVxdWVzdDogUGFyc2UuQ2xvdWQuRnVuY3Rpb25SZXF1ZXN0LCByZXNwb25zZTogUGFyc2UuQ2xvdWQuRnVuY3Rpb25SZXNwb25zZSkge1xuICByZXNwb25zZS5zdWNjZXNzKCdIZWxsbyB3b3JsZCEnKTtcbn0pO1xuXG5QYXJzZS5DbG91ZC5kZWZpbmUoJ3RvZ2dsZUxpa2UnLCBmdW5jdGlvbihyZXF1ZXN0OiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlcXVlc3QsIHJlc3BvbnNlOiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlc3BvbnNlKSB7XG5cbiAgLy8g5Lq644Gudm9pY2Xjga5saWtjZUNvdW5044KSaW5jcmVtZW5044GZ44KL44Gu44GndXNlTWFzdGVyS2V5XG4gIFBhcnNlLkNsb3VkLnVzZU1hc3RlcktleSgpO1xuICB2YXIgdm9pY2UgPSByZXF1ZXN0LnBhcmFtcy52b2ljZTtcbiAgLy8g4oaT44Gu44OI44Kw44Or44Gv44Ot44O844Kr44Or44Gn5a6f5pa95riI44G/XG4gIC8vIHZvaWNlLmxpa2UgPSAhdm9pY2UubGlrZTtcblxuICB2YXIgUGFyc2VWb2ljZSA9IFBhcnNlLk9iamVjdC5leHRlbmQoJ1ZvaWNlJyk7XG4gIHZhciBwYXJzZVZvaWNlID0gbmV3IFBhcnNlVm9pY2UoKTtcbiAgcGFyc2VWb2ljZS5pZCA9IHZvaWNlLm9iamVjdElkO1xuXG4gIGlmICh2b2ljZS5saWtlKSB7XG4gICAgcmVxdWVzdC51c2VyLmFkZFVuaXF1ZSgnbGlrZXMnLCB2b2ljZS5vYmplY3RJZCk7XG4gICAgcGFyc2VWb2ljZS5pbmNyZW1lbnQoJ2xpa2VDb3VudCcpO1xuICB9IGVsc2Uge1xuICAgIHJlcXVlc3QudXNlci5yZW1vdmUoJ2xpa2VzJywgdm9pY2Uub2JqZWN0SWQpO1xuICAgIHBhcnNlVm9pY2UuaW5jcmVtZW50KCdsaWtlQ291bnQnLCAtMSk7XG4gIH1cblxuICByZXF1ZXN0LnVzZXIuc2F2ZSgpXG4gIC50aGVuKCh1c2VyOiBQYXJzZS5Vc2VyKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ3VzZXI6ICcgKyB1c2VyKTtcbiAgICBjb25zb2xlLmxvZygnbGlrZXM6ICcgKyB1c2VyLmdldCgnbGlrZXMnKSk7XG4gICAgcmV0dXJuIHBhcnNlVm9pY2Uuc2F2ZSgpO1xuICB9LFxuICAoZXJyb3I6IFBhcnNlLkVycm9yKSA9PiB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6ICcgKyBlcnJvci5jb2RlICsgJyAnICsgZXJyb3IubWVzc2FnZSk7XG5cbiAgICByZXNwb25zZS5lcnJvcignRXJyb3I6ICcgKyBlcnJvci5jb2RlICsgJyAnICsgZXJyb3IubWVzc2FnZSk7XG4gIH0pXG4gIC50aGVuKChwYXJzZVZvaWNlOiBQYXJzZS5PYmplY3QpID0+IHtcbiAgICBjb25zb2xlLmxvZygnbGlrZUNvdW5kOiAnICsgcGFyc2VWb2ljZS5nZXQoJ2xpa2VDb3VudCcpKTtcbiAgICByZXNwb25zZS5zdWNjZXNzKHBhcnNlVm9pY2UuZ2V0KCdsaWtlQ291bnQnKSk7XG4gIH0sXG4gIChlcnJvcjogUGFyc2UuRXJyb3IpID0+IHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogJyArIGVycm9yLmNvZGUgKyAnICcgKyBlcnJvci5tZXNzYWdlKTtcblxuICAgIHJlc3BvbnNlLmVycm9yKCdFcnJvcjogJyArIGVycm9yLmNvZGUgKyAnICcgKyBlcnJvci5tZXNzYWdlKTtcbiAgfSk7XG5cbn0pO1xuXG5QYXJzZS5DbG91ZC5kZWZpbmUoJ3NhdmVUYWcnLCBmdW5jdGlvbihyZXF1ZXN0OiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlcXVlc3QsIHJlc3BvbnNlOiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlc3BvbnNlKSB7XG4gIHZhciB0YWdzOiBzdHJpbmdbXSA9IHJlcXVlc3QucGFyYW1zLnRhZ3M7XG5cbiAgdGFncy5mb3JFYWNoKCh0YWc6IHN0cmluZykgPT4ge1xuICAgIGNvbnNvbGUubG9nKHRhZyk7XG4gICAgdmFyIFBhcnNlVGFnID0gUGFyc2UuT2JqZWN0LmV4dGVuZCgnVGFnJyk7XG5cbiAgICB2YXIgcXVlcnkgPSBuZXcgUGFyc2UuUXVlcnkoUGFyc2VUYWcpO1xuICAgIHF1ZXJ5LmVxdWFsVG8oJ3RhZycsIHRhZyk7XG4gICAgcXVlcnkuY291bnQoKS50aGVuKChjb3VudDogbnVtYmVyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnY291bnQ6ICcgKyBjb3VudCk7XG4gICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgdmFyIHBhcnNlVGFnID0gbmV3IFBhcnNlVGFnKCk7XG4gICAgICAgIHBhcnNlVGFnLnNldCgndGFnJywgdGFnKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlVGFnLnNhdmUoKTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC50aGVuKChwYXJzZVRhZzogUGFyc2UuT2JqZWN0KSA9PiB7XG4gICAgICBpZiAocGFyc2VUYWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NhdmVkIHRhZzogJyArIHBhcnNlVGFnLmdldCgndGFnJykpXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxuUGFyc2UuQ2xvdWQuZGVmaW5lKCdhZGRGYW1pbHknLCBmdW5jdGlvbihyZXF1ZXN0OiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlcXVlc3QsIHJlc3BvbnNlOiBQYXJzZS5DbG91ZC5GdW5jdGlvblJlc3BvbnNlKSB7XG5cbiAgdmFyIGZhbWlseUFwcGxpY2F0aW9uOiBjaGF2by5GYW1pbHlBcHBsaWNhdGlvbiA9IHJlcXVlc3QucGFyYW1zLmZhbWlseUFwcGxpY2F0aW9uO1xuXG4gIHZhciBQYXJzZUNoaWxkID0gUGFyc2UuT2JqZWN0LmV4dGVuZCgnQ2hpbGQnKTtcbiAgdmFyIHF1ZXJ5ID0gbmV3IFBhcnNlLlF1ZXJ5KFBhcnNlQ2hpbGQpO1xuICBxdWVyeS5maW5kKCkudGhlbigoY2hpbGRyZW46IFBhcnNlLk9iamVjdFtdKSA9PiB7XG5cbiAgICAvLyDkurrjga5DaGlsZOOCkuWFseacieOBmeOCi+OCiOOBhuOBq0FDTOOCkue3qOmbhuOBmeOCi+OBruOBp+ODnuOCueOCv+ODvOOCreODvOS9v+eUqOOAglxuICAgIFBhcnNlLkNsb3VkLnVzZU1hc3RlcktleSgpO1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBQYXJzZS5PYmplY3QpID0+IHtcbiAgICAgIHZhciBjaGlsZEFDTCA9IG5ldyBQYXJzZS5BQ0woZmFtaWx5QXBwbGljYXRpb24uZnJvbVVzZXJJZCk7XG4gICAgICBjaGlsZEFDTC5zZXRSZWFkQWNjZXNzKGZhbWlseUFwcGxpY2F0aW9uLmZyb21Vc2VySWQsIHRydWUpO1xuICAgICAgY2hpbGRBQ0wuc2V0V3JpdGVBY2Nlc3MoZmFtaWx5QXBwbGljYXRpb24uZnJvbVVzZXJJZCwgdHJ1ZSk7XG4gICAgICBjaGlsZC5zZXRBQ0woY2hpbGRBQ0wpO1xuICAgICAgLy8gdG9kbzogcHJvbWlzZeWMllxuICAgICAgY2hpbGQuc2F2ZSgpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9