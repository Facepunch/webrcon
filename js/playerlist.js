
app.controller( 'PlayerListController',  PlayerListController );

function PlayerListController( $scope, rconService, $interval )
{
	$scope.Output = new Array();

	$scope.Refresh = function ()
	{
		rconService.Request( "playerlist", $scope, function ( msg )
		{
			$scope.Players = JSON.parse( msg.Message );
		});
	}

	rconService.InstallService( $scope, $scope.Refresh )

	var timer = $interval( function ()
	{
		//$scope.Refresh();
	}.bind( this ), 1000 );

	$scope.$on( '$destroy', function () { $interval.cancel( timer ) } )
}