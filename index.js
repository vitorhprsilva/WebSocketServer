const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// const express = require('express');

// const app = express();


const server = http.createServer();
server.listen(webSocketServerPort);
console.log("listening on port " + webSocketServerPort)


const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

const getUniqueID = () =>{
  const s4 = ()=> Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

wsServer.on('request', (request)=>{
  var userID = getUniqueID();

  console.log((new Date()) + ' Receved a new connection from origin ' + request.origin + '.')

  const connection = request.accept(null, request.origin);

  clients[userID] = connection;

  connection.on('message', function (message) {
    if(message.type === 'utf8'){

      console.log('Received Message: ', message.utf8Data);

      for(key in clients ){
        clients[key].sendUTF(message.utf8Data);
        console.log('sent Message to: ', clients[key]);
      }
    }
  })

})

// app.listen(webSocketServerPort);
