var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  	
  	console.log('a user connected');
  	io.emit('chat.welcome', messages);

  	socket.on('disconnect', function(){
    	console.log('user disconnected');
  	});

  	socket.on('chat.message', function(msg){
	    console.log('message: ' + msg);
	    messages.push(msg);
	    io.emit('chat.message', msg);
  	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});