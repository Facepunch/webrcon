
app.controller( 'PlayerInfoController', PlayerInfoController );

function PlayerInfoController( $scope, rconService, $routeParams )
{
	$scope.userid = $routeParams.userid;
}