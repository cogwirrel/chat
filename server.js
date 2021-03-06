var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var ip = '0.0.0.0';
var port = process.env.PORT || 1337;

var app = connect();

var serve = serveStatic('client');

app.use(function(req, res) {
	console.log(req.url);
	serve(req, res);
});

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
