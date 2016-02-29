

var app = angular.module( 'RconApp', ['ngMaterial', 'ngRoute', 'nvd3'] );

app.service( 'rconService', [RconService] );

app.config( function ( $mdThemingProvider, $routeProvider )
{
	$mdThemingProvider.theme( 'default' ).primaryPalette( 'blue',
	{
		'default': '700'
	}).accentPalette( 'blue' );

	$routeProvider.when( "/console", { Title: "Console", templateUrl: "html/console.html", Nav: true } )
	$routeProvider.when( "/playerlist", { Title: "Player List", templateUrl: "html/playerlist.html", Nav: true } )
	$routeProvider.when( "/player/:userid", { Title: "Player Info", templateUrl: "html/playerInfo.html" } )
	$routeProvider.when( "/player/:userid/xp", { Title: "Player Xp Stats", templateUrl: "html/playerXp.html" } )
	.otherwise( { redirectTo: '/console' } );

} );

app.controller( 'RconController', RconController );

function RconController( $scope, $rootScope, rconService, $mdSidenav, $timeout, $mdDialog, $route )
{
	$scope.$route = $route;

	$scope.pages = $.map( $route.routes, function ( value, index )
	{
		return [value];
	} );

	$scope.OpenLeftMenu = function ()
	{
		$mdSidenav( 'left' ).toggle();
	};

	$scope.IsConnected = function ()
	{
		return rconService.IsConnected();
	}

	$rootScope.$on( '$stateChangeStart', function ( next, current )
	{
		console.log( next );
	} );

	rconService.OnOpen = function ()
	{
		$scope.Connected = true;
		$scope.$broadcast( "OnConnected" );
		$scope.$digest();
	}

	rconService.OnClose = function ( ev )
	{
		$scope.$broadcast( "OnDisconnected", ev );
		$scope.$digest();
	}

	rconService.OnError = function ( ev )
	{
		$scope.$broadcast( "OnConnectionError", ev );
		$scope.$digest();
	}

	rconService.OnMessage = function ( msg )
	{
		$scope.$apply( function ()
		{
			$scope.$broadcast( "OnMessage", msg );
		} );
	}
}

app.controller( 'ConnectionController', ConnectionController );

function ConnectionController( $scope, rconService )
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
}






app.filter( 'SecondsToDuration', [SecondsToDuration] );

function SecondsToDuration()
{
	return function ( input )
	{
		input = parseInt( input );

		var out = "";
		var hours = Math.floor( input / 3600 );
		if ( input > 3600 ) out += hours + "h ";

		var minutes = Math.floor( input / 60 ) % 60;
		if ( input > 60 ) out += minutes + "m ";

		var seconds = input % 60;
		out += seconds + "s";

		return out;
	}
}
