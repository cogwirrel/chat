var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var ip = '192.168.1.224';
var port = 1337;

var app = connect();
app.use(serveStatic('client'));

var httpServer = http.createServer(app);

var io = require('socket.io')(httpServer);
httpServer.listen(port, ip);

// Socket stuff
io.on('connection', function(socket) {
	console.log("User connected");

	socket.on('msg', function(msg) {
		console.log(msg.text);
	});
});