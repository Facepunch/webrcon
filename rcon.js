

var app = angular.module('RconApp', ['ngMaterial', 'ngRoute']);

app.config( function( $mdThemingProvider, $routeProvider ) 
{
	$mdThemingProvider.theme('default').primaryPalette('blue').accentPalette('orange');
	
	$routeProvider.when( "/console", { templateUrl: 'partials/phone-list.html'} )
	$routeProvider.when( "/players", { templateUrl: 'partials/players.html'} )
	.otherwise( {redirectTo: '/console'} );
	
});

app.controller('RconController',  RconController);

function RconController( $scope, rconService, $mdSidenav, $timeout, $mdDialog )
{
	$scope.pages = 
	[
		{ Name: "console", Title: "Console", Page: "html/console.html" },
		{ Name: "players", Title: "Players", Page: "html/players.html" },
	]
	
	$scope.SwitchPage = function( page )
	{
		$scope.CurrentPage = page;
	}
	
	$scope.OpenLeftMenu = function() 
	{
		$mdSidenav('left').toggle();
	};
	
	$scope.SwitchPage( $scope.pages[0] );
		
	$scope.IsConnected = function()
	{
		return rconService.IsConnected();
	}
	
	rconService.OnOpen = function()
	{
		$scope.Connected = true;
		$scope.$broadcast( "OnConnected" );
		$scope.$digest();
	}
	
	rconService.OnClose = function( ev )
	{
		$scope.$broadcast( "OnDisconnected", ev );
		$scope.$digest();
	}
	
	rconService.OnError = function( ev )
	{
		$scope.$broadcast( "OnConnectionError", ev );
		$scope.$digest();
	}
	
	rconService.OnMessage = function( msg )
	{
		$scope.$broadcast( "OnMessage", msg );
	}
}

app.controller('ConnectionController',  ConnectionController);

function ConnectionController( $scope, rconService )
{
	$scope.Address = "";
	$scope.Password = "";
	$scope.SaveConnection = true;
	
	if ( localStorage.previousConnections != null )
		$scope.PreviousConnects = angular.fromJson( localStorage.previousConnections );
		
	if ( $scope.PreviousConnects == null )
		$scope.PreviousConnects = new Array();
		
	console.log( $scope.PreviousConnects  );

	$scope.Connect = function()
	{	
		$scope.LastErrorMessage  = null;
		rconService.Connect( $scope.Address, $scope.Password );
	}
	
	$scope.ConnectTo = function( c )
	{
		$scope.SaveConnection = false;
		$scope.LastErrorMessage  = null;
		rconService.Connect( c.Address, c.Password );
	}
		
	$scope.$on( "OnDisconnected", function( x, ev )
	{
		console.log( ev );
		$scope.LastErrorMessage = "Connection was closed - Error " + ev.code;
		$scope.$digest();
	});
	
	$scope.$on( "OnConnected", function( x, ev )
	{	
		if ( $scope.SaveConnection )
		{
			$scope.PreviousConnects.push( { Address: $scope.Address, Password: $scope.Password } );
			localStorage.previousConnections = angular.toJson( $scope.PreviousConnects );
		}
	});
}


app.controller('ConsoleController', ['$scope', 'rconService', ConsoleController]);

function ConsoleController( $scope, rconService )
{
	$scope.Output = new Array();
	
	$scope.SubmitCommand = function()
	{
		rconService.Command( $scope.Command, 1 );		
		$scope.Output.push( { Class: "input", "Message": "> " + $scope.Command } );
		
		$scope.Command = "";
	}
	
	$scope.$on( "OnMessage", function( event, msg )
	{
		if ( msg.Message.startsWith( "[CHAT] " ) )
			msg.Class = "Chat";
	
		if ( msg.Identifier == 1 )
			msg.Class = "Requested";
			
		if ( msg.Identifier > 1 )
			return;
	
		$scope.Output.push( msg );
		$scope.$digest();
		
		$("#ConsoleController .Output").scrollTop($("#ConsoleController .Output")[0].scrollHeight);
		
	});
}


app.controller('PlayersController', ['$scope', 'rconService', PlayersController]);

function PlayersController( $scope, rconService )
{
	$scope.Output = new Array();
	
	$scope.Refresh = function()
	{
		rconService.Command( "playerlist", 2 );
	}
	
	$scope.$on( "OnConnected", function( event )
	{
		$scope.Refresh();
	});
	
	$scope.$on( "OnMessage", function( event, msg )
	{
		if ( msg.Identifier != 2 )
			return;
	
		$scope.Players = JSON.parse( msg.Message );
	});
	
	
}


app.service('rconService', [RconService]);

function RconService()
{
	var s = {};
	
	s.Connect = function( addr, pass )
	{
		s.Socket = new WebSocket( "ws://" + addr + "/" + pass );
		
		s.Socket.onmessage = function (e)
		{
			if (s.OnMessage != null)
			{
				s.OnMessage( JSON.parse( e.data ) );
			}
		};
		
		s.Socket.onopen = s.OnOpen;
		s.Socket.onclose = s.OnClose;
		s.Socket.onerror = s.OnError;
		
		console.log( s.Socket );
	}
	
	s.Command = function( msg, identifier )
	{
		if (identifier == null)
			identifier = -1;

		var packet =
			{
				Identifier: identifier,
				Message: msg,
				Name: "WebRcon"
			}

		s.Socket.send( JSON.stringify( packet ) );
	};
	
	s.IsConnected = function()
	{
		if ( s.Socket == null ) return false;
		console.log( s.Socket );
		
		return true;
	}

	return s;
}

app.filter('SecondsToDuration', [SecondsToDuration]);

function SecondsToDuration() 
{
	return function ( input ) 
	{
		input = parseInt( input );
		
		var out = "";
		var hours = Math.floor(input / 3600);
		if ( input > 3600 ) out += hours + "h ";
		
		var minutes = Math.floor(input / 60) % 60;
		if ( input > 60 ) out += minutes + "m ";
		
		var seconds = input % 60;
		out += seconds + "s";
		
		return out;
	}
}
 