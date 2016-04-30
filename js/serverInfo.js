
app.controller( 'ServerInfoController', ServerInfoController );

function ServerInfoController( $scope, rconService, $routeParams )
{
	$scope.info = {};

	$scope.Refresh = function ()
	{
		rconService.Request( 'serverinfo', $scope, function ( msg )
		{
			$scope.info = JSON.parse( msg.Message );
			// $scope.Players = JSON.parse( msg.Message );

			console.log($scope.info);
		});
	}

	rconService.InstallService( $scope, $scope.Refresh );
}
