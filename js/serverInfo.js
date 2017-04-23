app.controller('ServerInfoController', ServerInfoController);

function ServerInfoController($scope, rconService, $routeParams, $interval) {

  var fpsData = [];
  var netData = [];

  // TODO: move serverinfo to service
  $scope.serverinfo = {};

  $scope.playersChart = {
    options: {
      chart: {
        type: "pieChart",
        height: 400,
        x: function(d) {
          return d.key;
        },
        y: function(d) {
          return d.value;
        },
        showLabels: false
      }
    },
    data: []
  };

  $scope.fpsChart = {
    options: {
      chart: {
        type: 'lineChart',
        height: 200,
        y: function(d) {
          return d.y;
        },
        useInteractiveGuideline: true,
        showXAxis: false,
        duration: 0,
        yAxis: {
          axisLabel: 'FPS',
          tickFormat: function(d) {
            return d3.format('.d')(d);
          }
        }
      }
    },
    data: [
      {
        values: [],
        key: 'FPS'
      }
    ]
  };

  $scope.netChart = {
    options: {
      chart: {
        "type": "stackedAreaChart",
        "height": 250,
        "useVoronoi": false,
        "duration": 0,
        "useInteractiveGuideline": true,
        showXAxis: false,
        "yAxis": {
          axisLabel: 'Network',
          tickFormat: function(d) {
            return d3.format('.d')(d) + 'kb';
          }
        }
      }
    },
    data: [
      {
        key: 'IN',
        values: []
      }, {
        key: 'OUT',
        values: []
      }
    ]
  };

  rconService.InstallService($scope, _refresh);

  // TODO: move updateinterval to service
  var timer = $interval(_refresh, 1000);
  $scope.$on("$destroy", function() {
    $interval.cancel(timer);
    $scope.serverinfo = {};
  });

  function _refresh() {
    rconService.Request('serverinfo', $scope, function(msg) {
      _updateData(JSON.parse(msg.Message));
    });
  }

  function _updateData(data) {
    $scope.serverinfo = data;

    $scope.playersChart.data.push({'players': data.Players, 'queued': data.Queued, 'joining': data.Joining});

    _collectChartData(data);
    _generateChartData();
  }

  function _collectChartData(data) {
    fpsData.push(data.Framerate);
    if (fpsData.length > 100) {
      fpsData.shift();
    }

    netData.push({in: data.NetworkIn, out: data.NetworkOut});
    if (netData.length > 100) {
      netData.shift();
    }
  }

  function _generateChartData() {
    var fpsChartValues = [];
    for (var i = 0; i < fpsData.length; i++) {
      fpsChartValues.push({x: i, y: fpsData[i]});
    }
    $scope.fpsChart.data[0].values = fpsChartValues;

    var netInChartValues = [];
    var netOutChartValues = [];
    for (var i = 0; i < netData.length; i++) {
      netInChartValues.push({x: i, y: netData[i]. in});
      netOutChartValues.push({x: i, y: netData[i].out});
    }
    $scope.netChart.data[0].values = netInChartValues;
    $scope.netChart.data[1].values = netOutChartValues;
  }

}
