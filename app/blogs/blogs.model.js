angular.module('app')
.factory('Blogs', function($resource) {
  return $resource('/api/blogs/:id', {id:'@_id'}, {
    update: {
      method: 'PUT'
    }
  });
});