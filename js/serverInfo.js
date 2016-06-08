
app.controller( 'ServerInfoController', ServerInfoController );

function ServerInfoController( $scope, rconService, $routeParams )
{
	$scope.info = {};

	$scope.refresh = function ()
	{
		rconService.Request( 'serverinfo', $scope, function ( msg ) {
			$scope.info = JSON.parse( msg.Message );
		});
	}

	rconService.InstallService( $scope, $scope.refresh );
}
