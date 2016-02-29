
app.controller( 'PlayerXpController', PlayerXpController );



function PlayerXpController( $scope, rconService, $routeParams )
{
	$scope.userid = $routeParams.userid;

	$scope.Sources =
	{
		Options: {
			chart: {
				type: "pieChart",
				height: 400,
				x: function ( d ) { return d.key; },
				y: function ( d ) { return d.value; },
				showLabels : false
			}
		}
	};

	$scope.Outgoings =
	{
		Options: {
			chart: {
				type: "pieChart",
				height: 400,
				x: function ( d ) { return d.key; },
				y: function ( d ) { return d.value; },
				showLabels: false
			}
		}
	};

	$scope.OverTime =
		{
			Options: {
				chart: {
					type: "multiBarChart",
					height: 700,
					stacked: true,
					x: function ( d ) { return d[0]; },
					y: function ( d ) { return Math.round( d[1] * 10 ) / 10; },
					showLabels: false,
					xAxis: { showMaxMin: false, tickFormat: function ( d ) { return d3.time.format( '%d %b %H%p' )( new Date( d ) ) } },
					yAxis: { tickFormat: function ( d ) { return d3.format( ',.2f' )( d ); } },
					clipEdge: true,
					useInteractiveGuideline: true,
					defined: function(d) { return d[0] != null }
				}
			}
		}

	$scope.Refresh = function ()
	{
		rconService.Request( "xp.history " + $scope.userid, $scope, function ( msg )
		{
			$scope.History = JSON.parse( msg.Message );

			$scope.Sources.Data = Enumerable.From( $scope.History )
				.Where( function ( x ) { return x.Amount > 0; } )
				.GroupBy( "$.Type", null,
                 function ( key, g )
                 {
                 	return {
                 		key: key,
                 		value: g.Sum( "$.Amount" )
                 	}
                 } )
				.ToArray();

			$scope.Outgoings.Data = Enumerable.From( $scope.History )
				.Where( function ( x ) { return x.Amount < 0; } )
				.GroupBy( "$.Type", null,
                 function ( key, g )
                 {
                 	return {
                 		key: key,
                 		value: -1 * g.Sum( "$.Amount" )
                 	}
                 } )
				.ToArray();

			var Hour = 60 * 60;

			$scope.OverTime.Data = FixMissingData( Enumerable.From( $scope.History )
				.Where( function ( x ) { return x.Amount > 0; } )
				.GroupBy( "$.Type", null,
                 function ( key, g )
                 {
                 	return {
                 		key: key,
                 		values: g.GroupBy( function ( x ) { return Math.round( x.Date / Hour ) * Hour; }, null, function ( key, g )
                 		{
                 			return [key * 1000, g.Sum( "$.Amount" )];
                 		} )
						.ToArray()
                 	}
                 } )
				.ToArray(), Hour * 1000 );

			console.log( $scope.OverTime.Data );
		} );
	}

	rconService.InstallService( $scope, $scope.Refresh )
}


// Fix missing gaps in a range
function FixMissingData( data, series )
{
	// Get the range
	var min = Enumerable.From( data ).Min( function ( x ) { return Enumerable.From( x.values ).Min( "$[0]" ); } )
	var max = Enumerable.From( data ).Max( function ( x ) { return Enumerable.From( x.values ).Max( "$[0]" ); } )

	// Fucking Javascript You Cunt
	data.forEach( function ( d )
	{
		var expected = min;
		var newData = [];

		d.values.forEach( function ( d )
		{
			while ( d[0] != expected && expected <= max )
			{
				newData.push( [expected, 0.0] );
				expected += series;
			}

			if ( d[0] == expected )
			{
				newData.push( d );
				expected += series;
			}
		} );

		while ( expected <= max )
		{
			newData.push( [expected, 0.0] );
			expected += series;
		}

		d.values = newData;
	} );

	return data;
}