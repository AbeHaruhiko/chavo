module chavo {
  'use strict';

  class Thing {
    public rank: number;
    public title: string;
    public url: string;
    public description: string;
    public logo: string;

    constructor(title: string, url: string, description: string, logo: string) {
      this.title = title;
      this.url = url;
      this.description = description;
      this.logo = logo;
      this.rank = Math.random();
    }
  }

  interface IMainScope extends ng.IScope {
    awesomeThings: Thing[]
  }

  export class MainCtrl {

    awesomeThings = new Array<Thing>();

    /* @ngInject */
    constructor (public $scope: IMainScope) {
      var awesomes = [
      {
        'title': 'AngularJS',
        'url': 'https://angularjs.org/',
        'description': 'HTML enhanced for web apps!',
        'logo': 'angular.png'
      }
    ];

      awesomes.forEach((awesome: Thing) => {
        this.awesomeThings.push(awesome);
      });
    }
  }

}
