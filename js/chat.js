
app.controller( 'ChatController', ChatController );

function ChatController( $scope, rconService, $timeout )
{
	$scope.Output = new Array();

	$scope.SubmitCommand = function ()
	{
		$scope.Output.push( { Message: $scope.Command, Type: 'Command' } );

		rconService.Command( "say " + $scope.Command, 1 );
		$scope.Command = "";
	}

	$scope.$on( "OnMessage", function ( event, msg ) { $scope.OnMessage( msg ); } );

	$scope.OnMessage = function( msg )
	{
		if ( msg.Type != "Chat" ) return;

		msg.Class = msg.Type;
		msg.Message = msg.Message.substr( 7 );
		$scope.Output.push( msg );

		$timeout( $scope.ScrollToBottom, 50 );
	}

	$scope.ScrollToBottom = function()
	{
		// TODO - don't scroll if we're not at the bottom !
		$( "#ChatController .Output" ).scrollTop( $( "#ChatController .Output" )[0].scrollHeight );
	}

	//
	// Calls console.tail - which returns the last 256 entries from the console.
	// This is then added to the console
	//
	$scope.GetHistory = function ()
	{
		console.log( "GetHistory" );

		rconService.Request( "console.tail 4096", $scope, function ( msg )
		{
			var messages = JSON.parse( msg.Message );

			messages.forEach( function ( x ) { $scope.OnMessage( x ); } );
		} );
	}

	rconService.InstallService( $scope, $scope.GetHistory )
}