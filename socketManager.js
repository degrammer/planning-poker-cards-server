"use latest";
module.exports = (function (io) {


    return {

        create: function (onSocketCreated) {

            io.set('transports', ['websocket', 'polling', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

            io.on('connection', function (connectionSocket) {

              if(onSocketCreated)
              {
                  onSocketCreated(connectionSocket);
              }
            
            });

        }

    };
});