var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var messages = [], users = [];

app.get('/', function(req, res){
  res.sendfile('chat.html');
});


app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));



io.on('connection', function(socket){
  	
  	console.log('a user connected');

  	io.emit('chat.welcome', {
        messages: messages,
        users: users
    });

  	socket.on('disconnect', function(){
    	console.log('a user disconnected :/', socket.username);
      removeUser(socket.username);
      console.log("emitting new userlist", users);
      io.emit('chat.users', users);
  	});

  	socket.on('chat.message', function(msg){
	    console.log('message: ' + msg);
      var email = msg.email;
      msg.user = userFromEmail(email);
	    messages.push(msg);
	    io.emit('chat.message', msg);
  	});

    socket.on('chat.user', function(user){
      console.log('new user added: ', user);
      users.push(user);
      socket.username = user.email;
      console.log("emitting new userlist", users);
      io.emit('chat.users', users);
    });
});

function userFromEmail(email) {
  for(var i in users) {
    if (users[i].email == email) {
      return users[i];
    }
  }
}

function removeUser(email) {
  for(var i in users) {
    if (users[i].email == email) {
      users.splice(i, 1);
    }
  }
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});
