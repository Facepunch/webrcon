
app.controller( 'ConnectionController', ConnectionController );

function ConnectionController( $scope, rconService, $routeParams, $timeout )
{
	$scope.Address = "";
	$scope.Password = "";
	$scope.SaveConnection = true;

	if ( localStorage.previousConnections != null )
		$scope.PreviousConnects = angular.fromJson( localStorage.previousConnections );

	if ( $scope.PreviousConnects == null )
		$scope.PreviousConnects = new Array();

	$scope.Connect = function ()
	{
		$scope.Address = $scope.Address.trim();
		$scope.Password = $scope.Password.trim();

		$scope.LastErrorMessage = null;
		rconService.Connect( $scope.Address, $scope.Password );
	}

	$scope.ConnectTo = function ( c )
	{
		$scope.SaveConnection = false;
		$scope.LastErrorMessage = null;
		rconService.Connect( c.Address, c.Password );
	}

	$scope.$on( "OnDisconnected", function ( x, ev )
	{
		console.log( ev );
		$scope.LastErrorMessage = "Connection was closed - Error " + ev.code;
		$scope.$digest();
	} );

	$scope.$on( "OnConnected", function ( x, ev )
	{
		if ( $scope.SaveConnection )
		{
			$scope.PreviousConnects.push( { Address: $scope.Address, Password: $scope.Password } );
			localStorage.previousConnections = angular.toJson( $scope.PreviousConnects );
		}
	} );


	//
	// If a server address is passed in.. try to connect if we have a saved entry
	//
	$timeout( function ()
	{
		$scope.Address = $routeParams.address;

		if ( $scope.Address != null )
		{
			var foundAddress = Enumerable.From( $scope.PreviousConnects ).Where( function ( x ) { return x.Address == $scope.Address } ).First();
			if ( foundAddress != null )
			{
				$scope.ConnectTo( foundAddress );
			}			
		}

	}, 20 );
}

