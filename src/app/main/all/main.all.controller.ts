module chavo {
  'use strict';

  export class MainAllController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {

      var ParseVoice = Parse.Object.extend('Voice');
  		var query = new Parse.Query(ParseVoice);
  		query.descending('createdAt');
  		query.find({
  		  success: (results: Parse.Object[]) => {

          // 表示用にVoiceクラスへ移し替え
          results.forEach((voice: Parse.Object) => {
            /*voice.set('genderDisp', voice.get('gender') == 0 ? '男の子' : voice.get('gender') == 1 ? '女の子' : '');*/
            this.voices.push(new Voice(
              voice.get('description'),
              voice.get('author'),
              (voice.get('ageYears') && voice.get('ageMonths')) ? (voice.get('ageYears') + '歳' + voice.get('ageMonths') + 'ヶ月') : '',
              voice.get('gender') == 0 ? '男の子' : voice.get('gender') == 1 ? '女の子' : '',
              null,   // TODO
              voice.createdAt    // TODO
            ));
          });

          this.$scope.$apply();
  		  },
  		  error: function(error: Parse.Error) {
  		    alert('Error: ' + error.code + ' ' + error.message);
  		  }
  		});
    }
  }

}
