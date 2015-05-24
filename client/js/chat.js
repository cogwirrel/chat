var socket = {};

var guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

$(document).ready(function() {

	var id = guid();

	// Don't submit the form as it kicks off a refresh!
	$('#chat-form').submit(function() {
		return false;
	});

	socket = io();

	socket.on('msg', function(msg) {
		if($('#' + msg.id).length) {
			// The message container exists
			$('#' + msg.id).append(msg.ch);
		} else {
			$('#chat-list').append('<li id="' + msg.id + '">' + msg.ch + '</li>');
			var chatList = document.getElementById('chat-list');
			chatList.scrollTop = chatList.scrollHeight;
		}
	});

	socket.on('backspace', function(backertron) {
		if($('#' + backertron.id).length) {
			// Chop off the last char!
			$('#' + backertron.id).text(function(_,txt) {
				return txt.slice(0, -1);
			});
		}
	});

	$('#chat-input').keypress(function(e) {

		if(e.which === 13) {
			// Pressed enter - don't send anything, just get a new guid!
			this.value = "";
			id = guid();
		} else {
			socket.emit('msg', {
				id: id,
				ch: String.fromCharCode(e.which)
			});
		}
	});

	$('#chat-input').keyup(function(e) {
		// Backspace only works for keyup :(
		if(e.which === 8) {
			console.log('backspace');
			// Pressed backspace
			socket.emit('backspace', {
				id: id
			});
		}
	});
});