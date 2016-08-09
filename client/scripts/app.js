// Display messages retrieved from the server

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var app = {
  server: 'https://api.parse.com/1/classes/messages',
  messages: [],
  roomnames: [],
  currRoom: false
};

var message = {
  username: 'shawndrost',
  text: 'trol\o<l{o',
  roomname: '4chan'
};



app.send = function (message) {
  $.ajax({
	// This is the url you should use to communicate with the parse API server.
    url: this.server,
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
    url: this.server,
    type: 'GET',
    success: this.recieve,
    error: function (data) {
  // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });	

};

app.filterText = function(text) {
  var r = new RegExp('&|<|>|"|\'|`|!|@|\\$|%|\\(|\\)|=|\\+|{|}|\\[|\\\\|\\]', 'g');
  if (text !== null) {
    text = text.replace(r, '');
  }

  return text;
};

app.recieve = function (data) {
	console.log(data);
  $('#chats').empty();
  var roomnames = data.results.map((el) => {
    var filtered = app.filterReceivedObject(el);
    if (filtered.roomname === app.currRoom) app.addMessage(filtered);
    else if (!app.currRoom) app.addMessage(filtered);
    return filtered.roomname;
  });
  app.setRoomDropDown(roomnames);
};

app.filterReceivedObject = function (rObject) {
  for (var key in rObject) {
    rObject[key] = app.filterText(rObject[key]);
  }
  return rObject;
};
 
$('.username').on('click', function (e) {

});

app.addMessage = function(message) {
  if (typeof message.username !== 'string') {
     message.username = 'BADUSER';
  } else {
    var r = new RegExp('[^a-zA-Z0-9]', 'g');
    message.username = message.username.replace(r , "");
  }
  var $span = $('<span></span>');
  var $a = $('<a></a>');
  $a.addClass('username');
  $a.on('click', function (e) {
    $(`.${message.username}`).toggleClass('friend');
  });
  $a.text(`${message.username} :`);

  var $message = $('<span></span><br>');
  $message.addClass(message.username);
  $message.text(`${message.text}`);


  $span.append($a);
  $span.append($message);

  $('#chats').append($span);
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addRoom = function(roomName) {
  $('#roomSelect').append(`<option value='${roomName}'>${roomName}</option>`);
};

app.setRoomDropDown = function(roomnames) {
  //given mesages,
  roomnames = _.uniq(roomnames);
  //if we have a roomname that isn't in the dropdown, add it to the dropdown
  roomnames.forEach(function (e) {
    if (!app.roomnames.includes(e)) {
      app.roomnames.push(e);
      app.addRoom(e);
    }
  });
};

app.handleDropdown = function (e) {
  var val = $('#roomSelect').val();
  if (val === 'CreateARoom') {
    val = prompt('Create a new room.');
    app.addRoom(val);
    $(`select option:contains('${val}')`).attr('selected', true);
  }
  app.currRoom = val;
};

//##TODO## add roomname support to message sending
app.init = function () {
  var fetcher = app.fetch.bind(app);
  setInterval(fetcher, 1000);

  var $ourButton = $('<input id="submitButton" type="button" value="Submit"></input>');
  $ourButton.on('click', function (e) {
  
    var message = $('#textInput').val();
    var message = {
      username: window.location.search.replace('username=', ""),
      text: message,
      roomname: app.currRoom
    };
    app.send(message);
  });
  $('#form').append($ourButton);
  $('#roomSelect').append('<option value="CreateARoom">Create a room</option>');
  $('#roomSelect').change(app.handleDropdown);

};

$(document).ready(app.init);
