
app.controller( 'ConsoleController', ['$scope', 'rconService', ConsoleController] );

function ConsoleController( $scope, rconService )
{
	$scope.Output = rconService.Output;

	$scope.SubmitCommand = function ()
	{
		rconService.Command( $scope.Command, 0 );
		$scope.Command = "";
	}

	$scope.$on( "OnMessage", function ( event, msg )
	{
		if ( msg.Message.startsWith( "[CHAT] " ) )
			msg.Class = "Chat";

		if ( msg.Identifier == 1 )
			msg.Class = "Requested";

		if ( msg.Identifier > 1 )
			return;

		$( "#ConsoleController .Output" ).scrollTop( $( "#ConsoleController .Output" )[0].scrollHeight );

	} );
}