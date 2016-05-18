
app.controller( 'ConsoleController', ConsoleController );

function ConsoleController( $scope, rconService, $timeout )
{
	$scope.Output = [];
	$scope.commandHistory = [];
	$scope.commandHistoryIndex = 0;

	$scope.KeyUp = function (event)
	{
		switch(event.keyCode) {
			
			// Arrow Up Key
			case 38:
				// rotate through commandHistory
				$scope.commandHistoryIndex++;
				if($scope.commandHistoryIndex >= $scope.commandHistory.length) {
					$scope.commandHistoryIndex = 0;
				}

				// set command from history 
				if($scope.commandHistory[$scope.commandHistoryIndex]) {
					$scope.Command = $scope.commandHistory[$scope.commandHistoryIndex];
				}
				
				break;

			default:
				// reset command history index
				$scope.commandHistoryIndex = 0;
				break;
		}
	}

	$scope.SubmitCommand = function ()
	{
		$scope.OnMessage( { Message: $scope.Command, Type: 'Command' } );

		$scope.commandHistory.push($scope.Command);

		rconService.Command( $scope.Command, 1 );
		$scope.Command = "";
		$scope.commandHistoryIndex = 0;
	}
	$scope.$on( "OnMessage", function ( event, msg ) { $scope.OnMessage( msg ); } );

	$scope.OnMessage = function( msg )
	{
		
		if ( msg.Message.startsWith( "[rcon] " ) ) return;
		if ( msg.Type != "Generic" && msg.Type != "Log" && msg.Type != "Error" && msg.Type != "Warning" )
		{
			console.log( msg );
			return;
		}

		msg.Class = msg.Type;
		$scope.Output.push( msg );

		$timeout( $scope.ScrollToBottom, 50 );
	}

	$scope.ScrollToBottom = function()
	{
		// TODO - don't scroll if we're not at the bottom !
		$( "#ConsoleController .Output" ).scrollTop( $( "#ConsoleController .Output" )[0].scrollHeight );
	}

	//
	// Calls console.tail - which returns the last 256 entries from the console.
	// This is then added to the console
	//
	$scope.GetHistory = function ()
	{
		console.log( "GetHistory" );

		rconService.Request( "console.tail 128", $scope, function ( msg )
		{
			var messages = JSON.parse( msg.Message );

			messages.forEach( function ( x ) { $scope.OnMessage( x ); } );
		} );
	}

	rconService.InstallService( $scope, $scope.GetHistory )
}