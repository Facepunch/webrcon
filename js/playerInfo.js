
app.controller( 'PlayerInfoController', PlayerInfoController );

function PlayerInfoController( $scope, rconService, $routeParams )
{
	$scope.userid = $routeParams.userid;

	$scope.info = null;

	$scope.refresh = function ()
	{
		rconService.getUsers($scope, function(users) {

			for(var i in users) {
				if(users[i].SteamID === $scope.userid){

					// set player data
					$scope.info = users[i];

					return;
				}
			}

			// info not found
			$scope.info = null;
		});
	}

	$scope.getUsername = function ()
	{
		if($scope.info && $scope.info.DisplayName) {
			return $scope.info.DisplayName;
		}

		return $scope.userid;
	}

	rconService.InstallService( $scope, $scope.refresh )
}