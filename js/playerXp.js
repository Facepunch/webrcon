
app.controller( 'PlayerXpController', PlayerXpController );

function PlayerXpController( $scope, rconService, $routeParams )
{
	$scope.userid = $routeParams.userid;
}