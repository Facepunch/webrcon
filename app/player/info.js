app.controller('playerInfoController', PlayerInfoController);

function PlayerInfoController($scope, connectionService, $routeParams) {
	$scope.userid = $routeParams.userid;

	$scope.info = null;

	$scope.refresh = function () {
		connectionService.getPlayers((players) => {

			for (var i in players) {
				if (players[i].SteamID === $scope.userid) {

					// set player data
					$scope.info = players[i];

					// remove xp remnants
					if ($scope.info['CurrentLevel'] !== undefined)
						delete $scope.info['CurrentLevel'];
					if ($scope.info['UnspentXp'] !== undefined)
						delete $scope.info['UnspentXp'];

					// fix violation level
					if ($scope.info['VoiationLevel'] !== undefined) {
						var violationLevel = $scope.info['VoiationLevel'];
						delete $scope.info['VoiationLevel'];
						$scope.info['ViolationLevel'] = violationLevel;
					}

					return;
				}
			}

			// player not found
			// reset data to null
			$scope.info = null;
		}, $scope);
	}

	$scope.getUsername = function () {
		// try to find players name in info
		if ($scope.info && $scope.info.DisplayName) {
			return $scope.info.DisplayName;
		}

		// otherwise show the id
		return $scope.userid;
	}

	connectionService.installService($scope, $scope.refresh)
}