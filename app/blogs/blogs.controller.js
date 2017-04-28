angular.module('app')
.controller('blogsController', function($scope, Blogs, $state) {
  $scope.blogs = Blogs.query();
  $scope.Date = Date;

  if($state.params.id) {
    $scope.blog = new Blogs({_id: $state.params.id});
    $scope.blog.$get();
  }

  $scope.showDetails = function(blog) {
    $scope.blog = blog;
    $state.go('blogs.details', {id: blog._id});
  };

  $scope.editPost = function(blog) {
    $scope.blog = blog;
    $state.go('blogs.edit', {id: blog._id});
  };

  $scope.deleteBlog = function(blog, index) {
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
  }
});