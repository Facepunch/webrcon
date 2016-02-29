
app.controller( 'PlayerListController',  PlayerListController );

function PlayerListController( $scope, rconService )
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
}