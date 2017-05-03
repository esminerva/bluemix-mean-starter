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