'use strict';

// Import files for webpack to package
require('./app.scss');
import angular from 'angular';
var blogs = require('./blogs/blogs');

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
}).controller('blogsController', blogs.controller)
  .factory('Blogs', blogs.model);
