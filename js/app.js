

var app = angular.module( 'RconApp', ['ngRoute', 'nvd3'] );

app.service( 'rconService', [RconService] );

app.config( function ( $routeProvider )
{
	$routeProvider.when( "/home", { Title: "Home" } )
	$routeProvider.when( "/:address/console", { Title: "Console", templateUrl: "html/console.html", Nav: true } )
	$routeProvider.when( "/:address/playerlist", { Title: "Player List", templateUrl: "html/playerlist.html", Nav: true } )
	$routeProvider.when( "/:address/player/:userid", { Title: "Player Info", templateUrl: "html/playerInfo.html" } )
	$routeProvider.when( "/:address/player/:userid/xp", { Title: "Player Xp Stats", templateUrl: "html/playerXp.html" } )
	$routeProvider.otherwise( { redirectTo: '/home' } );

} );

app.controller( 'RconController', RconController );

function RconController( $scope, $rootScope, rconService, $timeout, $route )
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

	$rootScope.Nav = function ( url )
	{
		return url.replace( ":address", rconService.Address );
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
		$scope.address = rconService.Address;
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

		if ( input < 3600 )
		out += seconds + "s";

		return out;
	}
}
