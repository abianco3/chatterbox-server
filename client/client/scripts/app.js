// YOUR CODE HERE:
//http://parse.sfm8.hackreactor.com/chatterbox/classes/messages

const app = {
  server: 'http://127.0.0.1:3000/',
  foundRooms: {},
  params: {order: '-createdAt'}
};

app.init = function() {
  this.fetch(this.params);
  var urlParams = window.location.search.split('=');
  window.username = urlParams[urlParams.length - 1];
  //setInterval(() => { this.fetch(this.params); }, 20000);
  console.log(username);
};


app.send = function(message) {
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      $('#chats').prepend(app.renderMessage(message));
      app.renderMessage(message);
      console.log('send worked', data);
    },
    error: function(data) {
      console.error('message failed?', data);
    }
  });
};

app.fetch = function(params) {
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    data: params,
    success: (data) => {
      console.log('fetch worked', data);
      this.clearMessages();
      data.results.forEach((message, index) => {
        $('#chats').append(this.renderMessage(message));
      });
      this.roomPopulate(data);
    },
    error: function(data) {
      console.error('failed ', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').children().remove();
};

app.renderMessage = function(message) {
  // var newUsername = '<div class="chat username">' + message.username + '</div>';
  // var newMessage = '<div class="chat">' + newUsername + message.text + '</div>';
  var $tweet = $('<div class="chat"></div>');
  var $username = $('<h4 class="username"></h4>');
  $username.append(document.createTextNode(message.username));
  $username.addClass(message.username);
  var $text = $('<p></p>');
  $text.append(document.createTextNode(message.text));
  $tweet.append($username);
  $tweet.append($text);
  $('.username').on('click', app.handleUsernameClick);
  
  return $tweet;
};

app.renderRoom = function(roomName) {
  var $option = $(`<option>${roomName}</option>`);
  $option.attr('value', roomName);
  $('#roomSelect').append($option);
};

app.handleUsernameClick = function() {
  // var $class = $(this).attr('class');
  // console.log($class);
  // //$(this).addClass('friend');
  // $('.' + $class).addClass('friend');

  var grabClasses = $(this).attr('class');
  var split = grabClasses.split(' ');
  var name = '.' + split[1];
  $(name).addClass('friend');

};

app.handleSubmit = function(event) {
  var message = {};
  message.username = window.username;
  message.text = $('#message').val();
  message.roomname = $('#roomSelect').val();
  this.send(message);
  return false;
};

app.roomPopulate = function(data) {
  var messages = data.results;
  messages.forEach((obj, i, collection) => {
    if (this.foundRooms[obj.roomname] === undefined) {
      this.foundRooms[obj.roomname] = obj.roomname;
      this.renderRoom(obj.roomname);
    }
  });
};

app.selectRoom = function(roomname) {
  this.params.where = '{"roomname": "' + roomname + '"}';
  this.fetch(this.params);
};

document.addEventListener('DOMContentLoaded', function() {
  $('.submit').on('click', this.handleSubmit.bind(this));
  this.init();
  $('.roomAdd').on('click', () => { 
    var roomName = $('#room').val();
    this.renderRoom(roomName);
  });
  $('#roomSelect').on('change', () => {
    var roomName = $('#roomSelect').val();
    this.selectRoom(roomName);
  });
}.bind(app));

