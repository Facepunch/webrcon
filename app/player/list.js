app.controller('playerListController', PlayerListController);

function PlayerListController($scope, connectionService, $interval) {
  $scope.orderBy = '-ConnectedSeconds';
  $scope.players = [];

  $scope.refresh = function () {
    connectionService.getPlayers((players) => {
      $scope.players = players;
    }, $scope);
  }

  $scope.order = function (field) {
    if ($scope.orderBy === field) {
      field = '-' + field;
    }

    $scope.orderBy = field;
  }

  $scope.sortClass = function (field) {
    if ($scope.orderBy === field) return 'sorting';
    if ($scope.orderBy === '-' + field) return 'sorting descending';

    return null;
  }

  $scope.kickPlayer = function (id) {
    connectionService.command('kick ' + id);

    $scope.refresh();
  }

  connectionService.installService($scope, $scope.refresh)

  // var timer = $interval( function ()
  // {
  // 	//$scope.Refresh();
  // }.bind( this ), 1000 );

  //$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}
