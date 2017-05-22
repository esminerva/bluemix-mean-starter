/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

'use strict';

function blogsModel($resource) {
  return $resource('/api/blogs/:id', {id:'@_id'}, {
    update: {
      method: 'PUT'
    }
  });
}

function blogsController($scope, Blogs, $state) {
  $scope.blogs = Blogs.query();
  $scope.Date = Date;

  if($state.params.id) {
    $scope.blog = new Blogs({_id: $state.params.id});
    $scope.blog.$get();
  } else if($state.is('blogs.new')) {
    $scope.blog = new Blogs();
  }

  $scope.newPost = function() {
    $scope.blog = new Blogs();
    $state.go('blogs.new');
  };

  $scope.showDetails = function(blog) {
    $scope.blog = blog;
    $state.go('blogs.details', {id: blog._id});
  };

  $scope.editPost = function(blog) {
    $scope.blog = blog;
    $state.go('blogs.edit', {id: blog._id});
  };

  $scope.deletePost = function(blog, index) {
    blog.$delete()
      .then(function success() {
        if(index || index > -1) {
          $scope.blogs.splice(index, 1);
        } else {
          $state.go('blogs', {}, {reload: true});
        }
      }, function error() {
        $scope.errorMessage = 'Failed to delete blog post';
      });
  };

  $scope.submitUpdate = function() {
    if($scope.blog._id) {
      $scope.blog.$update()
        .then(function success() {
          $state.go('blogs.details', {id: $scope.blog._id});
        }, function error() {

        });
    } else {
      $scope.blog.$save()
        .then(function success() {
          $state.go('blogs', {}, {reload: true});
        }, function error() {

        });
    }
  };
}

module.exports = {
  model: blogsModel,
  controller: blogsController
};