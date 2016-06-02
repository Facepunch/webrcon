
app.controller( 'PlayerListController',  PlayerListController );

function PlayerListController( $scope, rconService, $interval )
{
	$scope.Output = [];
	$scope.OrderBy = '-ConnectedSeconds';

	$scope.Refresh = function ()
	{
		rconService.getPlayers($scope, function ( players )
		{
			$scope.Players = players;
		});
	}

	$scope.Order = function( o )
	{
		if ( $scope.OrderBy == o )
		{
			o = '-' + o;
		}

		$scope.OrderBy = o;
	}

	$scope.SortClass = function( o )
	{
		if ( $scope.OrderBy == o ) return "active";
		if ( $scope.OrderBy == "-" + o ) return "active descending";

		return null;
	}

	$scope.KickPlayer = function ( id )
	{
		rconService.Command( 'kick ' + id );

		$scope.Refresh();
	}

	rconService.InstallService( $scope, $scope.Refresh )

	var timer = $interval( function ()
	{
		//$scope.Refresh();
	}.bind( this ), 1000 );

	$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}