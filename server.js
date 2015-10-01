var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var messages = [], users = [];

app.get('/', function(req, res){
  res.sendfile('chat.html');
});

app.use("/css", express.static(__dirname + '/css'));

io.on('connection', function(socket){
  	
  	console.log('a user connected');

  	io.emit('chat.welcome', {
        messages: messages,
        users: users
    });

  	socket.on('disconnect', function(){
    	console.log('a user disconnected :/', socket.username);
      //delete users[socket.username];
      users.splice(users.indexOf(socket.username), 1);
      console.log("emitting new userlist", users);
      io.emit('chat.users', users);
  	});

  	socket.on('chat.message', function(msg){
	    console.log('message: ' + msg);
	    messages.push(msg);
	    io.emit('chat.message', msg);
  	});

    socket.on('chat.user', function(user){
      console.log('new user added: ' + user);
      users.push(user);
      socket.username = user;
      io.emit('chat.users', users);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
