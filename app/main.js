var app = angular.module('app', ['ngRoute', 'nvd3']);

app.service('connectionService', [ConnectionService]);

app.config(function ($routeProvider) {
  $routeProvider.when("/home", {
      title: "Home"
    })
    .when("/:address/info", {
      title: "Server",
      templateUrl: "app/server/info.html",
      nav: true
    })
    .when("/:address/console", {
      title: "Console",
      templateUrl: "app/console/console.html",
      nav: true
    })
    .when("/:address/chat", {
      title: "Chat",
      templateUrl: "app/chat/chat.html",
      nav: true
    })
    .when("/:address/playerlist", {
      title: "Player List",
      templateUrl: "app/player/list.html",
      nav: true
    })
    .when("/:address/player/:userid", {
      title: "Player Info",
      templateUrl: "app/player/info.html"
    })
    .otherwise({
      redirectTo: '/home'
    });
});

app.filter('SecondsToDuration', [secondsToDuration]);

function secondsToDuration() {
  return function (input) {
    input = parseInt(input);

    var out = "";
    var hours = Math.floor(input / 3600);
    if (input > 3600)
      out += hours + "h";

    var minutes = Math.floor(input / 60) % 60;
    if (input > 60)
      out += minutes + "m";

    var seconds = input % 60;
    out += seconds + "s";

    return out;
  }
}