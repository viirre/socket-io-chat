var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var channels = [], messages = [], users = [];

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
      var user = userFromEmail(socket.username);
      removeUser(socket.username);
      console.log("emitting new userlist", users);
      var msg = {
        user: user,
        msg_type: 'system',
        content: user.name + ' left the chat',
        date: new Date() 
      };
      io.emit('chat.message', msg);
      io.emit('chat.users', users);
  	});

  	socket.on('chat.message', function(msg){
	    console.log('message: ' + msg);
      msg.msg_type = 'user';
	    messages.push(msg);
	    io.emit('chat.message', msg);
  	});

    socket.on('chat.user', function(user){
      console.log('new user added: ', user);
      users.push(user);
      socket.username = user.email;
      console.log("emitting new userlist", users);

      var msg = {
        user: user,
        msg_type: 'system',
        content: user.name + ' joined the chat',
        date: new Date() 
      };
      io.emit('chat.message', msg);
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

http.listen(3999, function(){
  console.log('listening on *:3999');
});
