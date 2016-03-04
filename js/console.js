
app.controller( 'ConsoleController', ConsoleController );

function ConsoleController( $scope, rconService, $timeout )
{
	$scope.Output = new Array();

	$scope.SubmitCommand = function ()
	{
		$scope.OnMessage( { Message: $scope.Command, Type: 'Command' } )

		rconService.Command( $scope.Command, 1 );
		$scope.Command = "";
	}

	$scope.$on( "OnMessage", function ( event, msg ) { $scope.OnMessage( msg ); } );

	$scope.OnMessage = function( msg )
	{
		// Ignore rcon entries
		if ( msg.Message.startsWith( "[rcon] " ) ) return;

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

		rconService.Request( "console.tail 256", $scope, function ( msg )
		{
			var messages = JSON.parse( msg.Message );

			messages.forEach( function ( x ) { $scope.OnMessage( x ); } );
		} );
	}

	rconService.InstallService( $scope, $scope.GetHistory )
}