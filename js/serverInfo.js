
app.controller( 'ServerInfoController', ServerInfoController );

function ServerInfoController( $scope, rconService, $routeParams, $interval )
{
	$scope.info = {};

	$scope.refresh = function ()
	{
		rconService.Request( 'serverinfo', $scope, function ( msg ) {
			$scope.info = JSON.parse( msg.Message );
		} );
	}

	rconService.InstallService( $scope, $scope.refresh );

	var timer = $interval( $scope.refresh, 500 );
	$scope.$on( "$destroy", function () { $interval.cancel( timer ); } );
}
