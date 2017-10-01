
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){
  socket.on('dragging', (data) => socket.broadcast.emit('dragging', data));
  // socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  // socket.on('cytoscape', (data) => socket.broadcast.emit('cytoscape', data));

}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
