angular.module('app', ['ui.router', 'ngResource'])
.config(function config($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/'
    })
    .state('blogs', {
      url: '/blogs',
      templateUrl: '/blogs/index.html',
      controller: 'blogsController'
    })
    .state('blogs.new', {
      url: '/new',
      templateUrl: '/blogs/edit.html'
    })
    .state('blogs.details', {
      url: '/:id',
      templateUrl: '/blogs/details.html'
    })
    .state('blogs.edit', {
      url: '/:id/edit',
      templateUrl: '/blogs/edit.html'
    });
});