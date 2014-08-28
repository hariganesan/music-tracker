// artist.js

app = angular.module('artistApp', [])

app.controller('ArtistController', ['$scope', '$http', '$templateCache', 
               function($scope, $http, $templateCache) {
  $scope.artists = [];
  $scope.albums = [];
  $scope.results = [{name: 'Jack White', id: "4FZ3j1oH43e7cukCALsCwf"}];

  $scope.addArtist = function(artist, id) {
    $scope.artists.push({name:artist, enabled: true});
    $scope.artistText = '';
    $scope.fetchAlbums(artist, id);
  }

  $scope.addArtistEnter = function() {
    if ($scope.results.length > 0) {
      $scope.addArtist($scope.results[0])
    }
  };

  $scope.addArtistClick = function(result) {
    $scope.addArtist(result.name, result.id);
    $scope.results = [];
    $scope.$broadcast('newItemAdded');
  };

  $scope.enabledCount = function() {
    var count = 0;
    angular.forEach($scope.artists, function(artist) {
      count += artist.enabled ? 0 : 1;
    });
    return count;
  };

  $scope.clearEnabled = function() {
    var newArtists = [];
    angular.forEach($scope.artists, function(artist) {
      if (!artist.enabled) {
        newArtists.push(artist);
      }
    })

    $scope.artists = newArtists;
  };

  $scope.clearArtists = function() {
    $scope.artists = [];
    $scope.albums = [];
  };

  // AJAX stuff

  $scope.fetchArtists = function(artist) {
    $http({method: 'GET', url: "https://api.spotify.com/v1/search?q="+artist+"&type=artist&limit=3", cache: $templateCache}).
      success(function(data, status) {
        if (data.items) {
          angular.forEach(data.items, function(item) {
            $scope.results.push({
              name: item.name,
              id: item.id
            });
          });
        }
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
  };

  $scope.fetchAlbums = function(artist, id) {
    $http({method: 'GET', url: "https://api.spotify.com/v1/artists/"+id+"/albums?album_type=album", cache: $templateCache}).
      success(function(data, status) {
        if (data.items) {
          angular.forEach(data.items, function(item, idx) {
            $scope.albums.push({
              artist: artist,
              name: item.name,
              year: "????"
            });

            $scope.fetchAlbumDate(item.id, idx);
          });
        }
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
  };

  $scope.fetchAlbumDate = function(id, idx) {
    if ($scope.albums.length <= idx) {
      return;
    }
    
    $http({method: 'GET', url: "https://api.spotify.com/v1/albums/"+id, cache: $templateCache}).
      success(function(data, status) {
        if (data.release_date) {
          $scope.albums[idx].year = data.release_date;
        } else {
          $scope.albums.splice(idx, 1);
        }
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
  };
}]);

app.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
});
