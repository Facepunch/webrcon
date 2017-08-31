app.controller('appController', AppController);

function AppController($scope, $rootScope, connectionService, $timeout, $route, $location) {
  $scope.$route = $route;

  $scope.pages = $.map($route.routes, (route) => {
    if (route.nav) {
      return [route];
    }
  });

  $scope.openLeftMenu = function () {
    $mdSidenav('left').toggle();
  };

  $scope.isConnected = function () {
    return connectionService.isConnected();
  }

  $rootScope.nav = function (url) {
    return url.replace(':address', connectionService.address);
  }

  $rootScope.$on('$stateChangeStart', function (next, current) {
    console.log(next);
  });

  connectionService.onOpen = function () {
    $scope.connected = true;
    $scope.$broadcast('onConnected');
    $scope.$digest();
    $scope.address = connectionService.address;
  }

  connectionService.onClose = function (ev) {
    $scope.$broadcast('onDisconnected', ev);
    $scope.$digest();
  }

  connectionService.onError = function (ev) {
    $scope.$broadcast('onConnectionError', ev);
    $scope.$digest();
  }

  connectionService.onMessage = function (data) {
    $scope.$apply(function () {
      $scope.$broadcast('onMessage', data);
    });
  }

  $scope.disconnect = function () {
    if (confirm('Do you really want to disconnect?')) {
      connectionService.disconnect();
      $scope.connected = false;

      $location.path('/home');
    }
  }

  // hide loading spinner
  $('#pageloader').hide();
}
