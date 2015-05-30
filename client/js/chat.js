var socket = {};

var guid = function() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
};

/* Returns a number between lower and upper, inclusive */
var random = function (lower, upper) {
  return lower + Math.floor(Math.random()*(upper + 1 - lower));
}

/* Returns a random element from the given array */
var randomElement = function (array) {
  return array[ random(0, array.length - 1) ];
}

var randomColour = function() {
	var colours = [
		'#0085c3',
		'#7ab800',
		'#f2af00',
		'#dc5034',
		'#ce1126',
		'#b7295a',
		'#71c6c1',
		'#5482ab',
		'#009bbb',
		'#eeeeee',
	];
	return randomElement(colours);
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
			$('#' + msg.id).css({'color': randomColour()});
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