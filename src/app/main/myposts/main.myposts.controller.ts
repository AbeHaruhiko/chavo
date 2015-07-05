module chavo {
  'use strict';

  export class MainMyPostsController {

    voices = new Array<Voice>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {

      var Voice = Parse.Object.extend('Voice');
  		var query = new Parse.Query(Voice);
  		query.descending('createdAt');
      query.equalTo('user', Parse.User.current());
  		query.find({
  		  success: (results: Voice[]) => {
          this.$scope.$apply(() => {
            this.voices = results;
          });
  		  },
  		  error: function(error: Parse.Error) {
  		    alert('Error: ' + error.code + ' ' + error.message);
  		  }
  		});
    }
  }

}
