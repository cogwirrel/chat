var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var ip = 'jackchat-oh-yeah.herokuapp.com';
var port = process.env.PORT || 1337;

var app = connect();
app.use(serveStatic('client'));

var httpServer = http.createServer(app);

var io = require('socket.io')(httpServer);
httpServer.listen(port, ip);

// Socket stuff
io.on('connection', function(socket) {
	
	// Receive a message - bounce it back to everyone!
	socket.on('msg', function(msg) {
		io.emit('msg', {
			id: msg.id,
			ch: msg.ch
		});
	});

	socket.on('backspace', function(msg) {
		io.emit('backspace', {
			id: msg.id
		});
	});
});