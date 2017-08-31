app.controller('chatController', ChatController);

function ChatController($scope, connectionService, $timeout) {
	$scope.output = [];

	$scope.submitCommand = function () {
		if (!$scope.command) {
			return;
		}

		connectionService.command('say ' + $scope.command, 1);
		$scope.command = '';
	}

	$scope.$on('onMessage', function (event, data) {
		if (data.Type !== 'Chat') return;

		$scope.onMessage(JSON.parse(data.Message));
	});

	$scope.onMessage = function (data) {
		data.Message = stripHtml(data.Message);
		$scope.output.push(data);

		if ($scope.isOnBottom()) {
			$scope.scrollToBottom();
		}
	}

	$scope.scrollToBottom = function () {
		var element = $('#ChatController .Output');

		$timeout(function () {
			element.scrollTop(element.prop('scrollHeight'));
		}, 50);
	}

	$scope.isOnBottom = function () {
		// get jquery element
		var element = $('#ChatController .Output');

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
	// Calls console.tail - which returns the last 256 entries from the console.
	// This is then added to the console
	//
	$scope.getHistory = function () {
		connectionService.request('chat.tail 512', $scope, function (data) {
			var messages = JSON.parse(data.Message);

			messages.forEach(function (message) {
				$scope.onMessage(message);
			});

			$scope.scrollToBottom();
		});
	}

	connectionService.installService($scope, $scope.getHistory)
}

function stripHtml(html) {
	if (!html) return '';

	var tmp = document.createElement('div');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || '';
}
