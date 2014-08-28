// artist.js

var app = angular.module('artistApp', ['ui']);

app.controller('ArtistController', ['$scope', '$http', '$templateCache', 
               function($scope, $http, $templateCache) {
  $scope.artists = [];
  $scope.albums = [];
  $scope.results = [];

  $scope.addArtist = function(artistName, id) {
    $scope.artists.push({name:artistName, id:id, enabled: true});
    $scope.searchText = '';
    $scope.fetchAlbums(artistName, id);
    $scope.results = [];
  }

  $scope.addArtistEnter = function() {
    if ($scope.results.length > 0) {
      $scope.addArtist($scope.results[0].name, $scope.results[0].id);
    }
  };

  $scope.addArtistClick = function(result) {
    $scope.addArtist(result.name, result.id);
    $scope.$broadcast('focusSearch');
  };

  $scope.checkSearch = function() {
    $scope.results = [];

    if ($scope.searchText && $scope.searchText.length > 2)
      $scope.fetchArtists();
  }

  $scope.toggleArtist = function(artist) {
    artist.enabled = !artist.enabled;

    angular.forEach($scope.albums, function(album) {
      if (album.artistID === artist.id) {
        album.enabled = artist.enabled;
      }
    });
  }

  $scope.isEnabled = function(item) {
    return item.enabled;
  }

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
    $scope.$broadcast('focusSearch');
  };

  // AJAX stuff

  $scope.fetchArtists = function() {
    artistName = $scope.searchText;

    $http({method: 'GET', url: "https://api.spotify.com/v1/search?q="+artistName+"&type=artist&limit=3", cache: $templateCache}).
      success(function(data, status) {
        if (data.artists.items) {
          angular.forEach(data.artists.items, function(item) {
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

  $scope.fetchAlbums = function(artistName, id) {
    $http({method: 'GET', url: "https://api.spotify.com/v1/artists/"+id+"/albums?album_type=album", cache: $templateCache}).
      success(function(data, status) {
        if (data.items) {
          angular.forEach(data.items, function(item) {
            $scope.albums.push({
              artist: artistName,
              artistID: id,
              name: item.name,
              year: "????",
              id: $scope.albums.length,
              enabled: true
            });

            $scope.fetchAlbumDate(item.id, $scope.albums.length-1);
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
