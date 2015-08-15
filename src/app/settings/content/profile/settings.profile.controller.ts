module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsProfileController {

    public profile: Profile;

    /* @ngInject */
    constructor (
      public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {

        this.profile = new Profile($rootScope.currentUser.getUsername(),
            $rootScope.currentUser.getEmail(),
            null,
            null);

            // ファイルインプットの設定
            var fileSelector: any = angular.element("#photo-selector");
            fileSelector.fileinput({"uploadUrl": "dummy", "dropZoneEnabled": false});

            // アップロード直前のイベントでParseに送る。（bootstrap-file-inputによるアップロードは失敗する。）
            fileSelector.on("filepreupload", function(event, data, previewId, index) {

              if (data.files.length > 0) {
                var file = data.files[0];
                var name = "photo.jpg";

                var parseFile = new Parse.File(name, file);
                parseFile.save().then(function() {

                  this.$rootScopes.currentMember.set("icon", parseFile);
                  this.$rootScopes.currentMember.save().then(() => {

                    var profilePhoto = this.$rootScopes.currentMember.get("icon");

                    $scope.$apply(function() {
                      this.profile.icon = profilePhoto.url();
                    });

                    // プレビュー消す
                    fileSelector.fileinput("clear");

                  }, function(error) {

                  });
                }, function(error) {
                  console.log(error);
                });
              }
            });


            fileSelector.on('fileuploaderror', function(event, data, previewId, index) {
              console.error('file upload error. (this is expected results.)')
            });


    }

    public saveProfile() {

      var profInput: { username: string; email: string; password?: string } = {
        username: this.profile.username,
        email: this.profile.email
      };

      if (this.profile.password) {
        profInput.password = this.profile.password;
      }

      this.$rootScope.currentUser.save(profInput)
      .then((user: Parse.User) => {
        console.log('ほぞんしました');
      }, (error: Parse.Error) => {
        console.log('Error: ' + error.code + ' ' + error.message);
      });

    }


  }
}
