// Display messages retrieved from the server

var app = {};

var message = {
  username: 'shawndrost',
  text: 'trololo',
  roomname: '4chan'
};

app.init = function () {};

app.send = function (message) {
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/messages',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message', data);
	  }
	});
};

app.fetch = function() {
	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: undefined,
	  type: 'GET',
	  dataType: 'json',
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message retrieved');
	    var result = 'hey!';
	    return result;
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to get message', data);
	  }
	});	

};

app.addMessage = function() {
	var result = app.fetch();
			$('#main').append('<div>'+ result +'</div>');

	// for (var i = 0; i < result.length; i++) {
	// }
}

app.clearMessages = function () {
	$('.message').remove();
};

app.addRoom = function() {};

app.addMessage();
setInterval(app.addMessage, 3000);
