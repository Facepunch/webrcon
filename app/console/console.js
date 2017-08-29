app.controller('consoleController', ConsoleController);

function ConsoleController($scope, connectionService, $timeout) {
	$scope.output = [];
	$scope.commandHistory = [];
	$scope.commandHistoryIndex = 0;

	$scope.keyUp = function (event) {
		switch (event.keyCode) {

			// Arrow Key Up
			case 38:

				// rotate through commandHistory
				$scope.commandHistoryIndex--;
				if ($scope.commandHistoryIndex < 0) {
					$scope.commandHistoryIndex = $scope.commandHistory.length;
				}

				// set command from history 
				if ($scope.commandHistory[$scope.commandHistoryIndex]) {
					$scope.command = $scope.commandHistory[$scope.commandHistoryIndex];
				}

				break;

				// Arrow Key Down
			case 40:

				// rotate through commandHistory
				$scope.commandHistoryIndex++;
				if ($scope.commandHistoryIndex >= $scope.commandHistory.length) {
					$scope.commandHistoryIndex = 0;
				}

				// set command from history 
				if ($scope.commandHistory[$scope.commandHistoryIndex]) {
					$scope.command = $scope.commandHistory[$scope.commandHistoryIndex];
				}

				break;

			default:
				// reset command history index
				$scope.commandHistoryIndex = $scope.commandHistory.length;
				break;
		}
	}

	$scope.submitCommand = function () {
		$scope.onMessage({
			Message: $scope.command,
			Type: 'Command'
		});

		$scope.commandHistory.push($scope.command);

		connectionService.command($scope.command, 1);
		$scope.command = '';
		$scope.commandHistoryIndex = 0;
	}

	$scope.$on('onMessage', function (event, data) {
		$scope.onMessage(data);
	});

	$scope.onMessage = function (data) {

		if (data.Message.startsWith('[rcon] ')) {
			return;
		}

		switch (data.Type) {
			case 'Generic':
			case 'Log':
			case 'Error':
			case 'Warning':
				$scope.addOutput(data);
				break;

			default:
				console.log(data);
				return;
		}
	}

	$scope.scrollToBottom = function () {
		var element = $('#ConsoleController .Output');

		$timeout(function () {
			element.scrollTop(element.prop('scrollHeight'));
		}, 50);
	}

	$scope.isOnBottom = function () {
		// get jquery element
		var element = $('#ConsoleController .Output');

		// height of the element
		var height = element.height();

		// scroll position from top position
		var scrollTop = element.scrollTop();

		//  full height of the element
		var scrollHeight = element.prop('scrollHeight');

		if ((scrollTop + height) > (scrollHeight - 10)) {
			return true;
		}

		return false;
	}

	//
	// Calls console.tail - which returns the last 128 entries from the console.
	// This is then added to the console
	//
	$scope.getHistory = function () {
		connectionService.request('console.tail 128', $scope, function (data) {
			var messages = JSON.parse(data.Message);

			messages.forEach(function (data) {
				$scope.onMessage(data);
			});

			$scope.scrollToBottom();
		});
	}

	$scope.addOutput = function (data) {
		data.Class = data.Type;
		$scope.output.push(data);

		if ($scope.isOnBottom()) {
			$scope.scrollToBottom();
		}
	}

	connectionService.installService($scope, $scope.getHistory)
}