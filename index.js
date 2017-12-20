
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

function onConnection(socket){
	//declaro todas as funções no nosso arquivo servidor. Emito o evento que eu quero junto com o seu parametro
  socket.on('adding', (nodedata) => socket.broadcast.emit('adding', nodedata));
  socket.on('removing', (nodeData) => socket.broadcast.emit('removing', nodeData));
  socket.on('dragging', (data) => socket.broadcast.emit('dragging', data));
  socket.on('renaming', (nodeDataRename) => socket.broadcast.emit('renaming', nodeDataRename));
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
