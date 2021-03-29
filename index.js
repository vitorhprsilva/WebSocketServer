const WebSocket = require('ws');
const express = require('express');
const PORT = 8000;
const app = express();

app.listen(PORT);

const wss = new WebSocket.Server({ port: PORT});

const clients = {};

const getUniqueID = () =>{
  const s4 = ()=> Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

wss.on('req', (req)=>{

  var userID = getUniqueID();

  console.log((new Date()) + ' Receved a new connection from origin ' + req.origin + '.')

  const connection = req.accept(null, req.origin);

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

console.log("listening on port " + PORT)

//https://oieduardorabelo.medium.com/node-js-usando-websockets-5d642456d1f3
