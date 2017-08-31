app.controller('connectionController', ConnectionController);

function ConnectionController($scope, connectionService, $routeParams, $timeout, $location) {
  $scope.address = '';
  $scope.password = '';
  $scope.saveConnection = true;

  $scope.connectionsLimit = 5;

  function _loadFromLocalStorage() {
    var connections = [];

    // load and parse from local storage
    if (localStorage && localStorage.previousConnections) {
      connections = angular.fromJson(localStorage.previousConnections);
    }

    // double check
    if (!connections) {
      connections = [];
    }

    return connections;
  }

  function _addWithoutDuplicates(connections, connection) {
    // prepare new array
    var filteredConnections = [];

    for (var i in connections) {
      if (connections[i].address !== connection.address && connections[i].password !== connection.password) {
        // add old connection info to our new array
        filteredConnections.push(connections[i]);
      }
    }

    // add new connection
    filteredConnections.push(connection);

    return filteredConnections;
  }

  $scope.toggleConnectionsLimit = function () {
    // toggle limit between undefined and 5
    // undefined sets limit to max
    if ($scope.connectionsLimit === undefined) {
      $scope.connectionsLimit = 5;
    } else {
      $scope.connectionsLimit = undefined;
    }
  }

  $scope.connect = function () {
    $scope.address = $scope.address.trim();
    $scope.password = $scope.password.trim();

    $scope.lastErrorMessage = null;
    connectionService.connect($scope.address, $scope.password);

    $location.path('/' + $scope.address + '/info');
  }

  $scope.connectTo = function (c) {
    $scope.saveConnection = false;
    $scope.lastErrorMessage = null;
    connectionService.connect(c.address, c.password);
  }

  $scope.$on('onDisconnected', function (x, ev) {
    $scope.lastErrorMessage = 'Connection was closed - Error ' + ev.code;
    $scope.$digest();

    $location.path('/home');
  });

  $scope.$on('onConnected', function (x, ev) {
    if ($scope.saveConnection) {
      // new connection to add
      var connection = {
        address: $scope.address,
        password: $scope.password,
        date: new Date()
      };

      // remove old entries and add our new connection info
      var connections = _addWithoutDuplicates(_loadFromLocalStorage(), connection);

      // push to scope and save data
      $scope.previousConnects = connections;
      localStorage.previousConnections = angular.toJson($scope.previousConnects);
    }
  });

  $scope.previousConnects = _loadFromLocalStorage();

  //
  // If a server address is passed in.. try to connect if we have a saved entry
  //
  $timeout(function () {
    $scope.address = $routeParams.address;

    //
    // If a password was passed as a search param, use that
    //
    var pw = $location.search().password;
    if (pw) {
      $scope.password = pw;
      $location.search('password', null);
    }

    if ($scope.address != null) {
      // If we have a password (passed as a search param) then connect using that
      if ($scope.password != '') {
        $scope.connect();
        return;
      }

      var foundAddress = $scope.previousConnects.find((item) => {
        return item.address === $scope.address
      })
      if (foundAddress != null) {
        $scope.connectTo(foundAddress);
      }

    }

  }, 20);

}
