angular.module('app')
.controller('blogsController', function($scope, Blogs) {
  $scope.blogs = Blogs.query();

  $scope.deleteBlog = function(blog, index) {
    blog.$delete()
      .then(function succeess() {
        $scope.blogs.splice(index, 1);
      }, function error() {

      });
  }
});