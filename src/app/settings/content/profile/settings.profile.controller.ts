module chavo {
  'use strict';

  interface ISettingsMenu extends ng.IScope {
  }

  export class SettingsProfileController {

    public profile: Profile;
    public showIcon: boolean = false;

    /* @ngInject */
    constructor (
      public $scope: ISettingsMenu,
      public $rootScope: IChavoRootScope) {

        this.profile = new Profile(
            $rootScope.currentUser.getUsername(),
            $rootScope.currentUser.getEmail(),
            null,
            $rootScope.currentUser.get('iconUrl'),
            $rootScope.currentUser.get('likes')
          );

        // ファイルインプットの設定
        var fileSelector: any = angular.element('#photo-selector');
        fileSelector.fileinput({
          'uploadUrl': 'dummy',
          'dropZoneEnabled': false,
          'showCaption': false,
          'showPreview': true,
          'browseClass': 'photo-browse-btn btn btn-primary btn-outline',
          'browseLabel': '画像選択'
        });

        // アップロード直前のイベントでParseに送る。（bootstrap-file-inputによるアップロードは失敗する。）
        fileSelector.on('filepreupload', (event: any, data: any, previewId: number, index: number) => {

          if (data.files.length > 0) {
            var file = data.files[0];
            var name = 'photo.jpg';

            var parseFile = new Parse.File(name, file);
            parseFile.save().then(() => {

              this.$rootScope.currentUser.set('icon', parseFile);
              this.$rootScope.currentUser.set('iconUrl', parseFile.url());

              return this.$rootScope.currentUser.save();
            }).then(() => {

              var profilePhoto = this.$rootScope.currentUser.get('icon');

              $scope.$apply(() => {
                this.profile.icon = profilePhoto.url();
                this.showIcon = true;
              });

              // プレビュー消す
              fileSelector.fileinput('clear');

            }, function(error: Parse.Error) {
              console.error(error);
            });
          }
        });


        // bootstrap-file-inputによるアップロードは失敗する。
        fileSelector.on('fileuploaderror', function(event: any, data: any, previewId: number, index: number) {
          // エラーメッセージは非表示
          angular.element('.file-error-message').css('display', 'none');

          console.error('file upload error. (this is expected results. please ignore.)');
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
