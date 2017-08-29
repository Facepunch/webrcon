function ConnectionService() {

  var ConnectionStatus = {
    'CONNECTING': 0,
    'OPEN': 1,
    'CLOSING': 2,
    'CLOSED': 3
  };

  var service = {
    socket: null,
    address: null,
    callbacks: {}
  };

  var lastIndex = 1001;

  service.connect = function (addr, pass) {
    this.socket = new WebSocket('ws://' + addr + '/' + pass);
    this.address = addr;

    this.socket.onmessage = function (e) {
      var data = JSON.parse(e.data);

      //
      // This is a targetted message, it has an identifier
      // So feed it back to the right callback.
      //
      if (data.Identifier > 1000) {
        var cb = service.callbacks[data.Identifier];
        if (cb != null) {
          cb.scope.$apply(function () {
            cb.callback(data);
          });
        }
        service.callbacks[data.Identifier] = null;

        return;
      }

      //
      // Generic console message, let OnMessage catch it
      //
      if (service.onMessage != null) {
        service.onMessage(data);
      }
    };

    this.socket.onopen = this.onOpen;
    this.socket.onclose = this.onClose;
    this.socket.onerror = this.onError;
  }

  service.disconnect = function () {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.callbacks = {};
  }

  service.command = function (msg, identifier) {
    if (this.socket === null)
      return;

    if (!this.isConnected())
      return;

    if (identifier === null)
      identifier = -1;

    var packet = {
      Identifier: identifier,
      Message: msg,
      Name: 'WebRcon'
    };

    this.socket.send(JSON.stringify(packet));
  };

  //
  // Make a request, call this function when it returns
  //
  service.request = function (msg, scope, callback) {
    lastIndex++;
    this.callbacks[lastIndex] = {
      scope: scope,
      callback: callback
    };
    service.command(msg, lastIndex);
  }

  //
  // Returns true if websocket is connected
  //
  service.isConnected = function () {
    if (this.socket == null)
      return false;

    return this.socket.readyState === ConnectionStatus.OPEN;
  }

  //
  // Helper for installing connectivity logic
  //
  // Basically if not connected, call this function when we are
  // And if we are - then call it right now.
  //
  service.installService = function (scope, callback) {
    if (this.isConnected()) {
      callback();
    } else {
      scope.$on('onConnected', () => {
        callback();
      });
    }
  }

  service.getPlayers = function (callback, scope) {
    this.request('playerlist', scope, (response) => {
      var players = JSON.parse(response.Message);

      if (typeof callback === 'function') {
        callback.call(scope, players);
      }
    });
  }

  return service;
}