var socket = io();

// create an object for storing our user
var user = {
  name: 'anon',
  type: 'player',
  valueOfHand: '',
  handType: '',
  payout: '',
  sameCard: '',
  cards: [],
  suited: '',
  allPictures: '',
}

// -----GENERAL JAVASCRIPT-----
//Menu Trigger
$('#menu').click(function() {
  $('.ui.sidebar')
    .sidebar('toggle');
})
$('#log-in').click(function() {
  console.log('click');
  $('.ui.modal')
    .modal('show')
  ;
})

// -----GAME JAVASCRIPT-----

// handle submission for CREATING the table
$('#createTable').click(function () {
  var currentUser = JSON.parse(currentUserString)
  user.name = currentUser.username
  user.credits = currentUser.credits
  user.type = 'banker'
  console.log('Creating table with name: ', user.name)
  socket.emit('create', user)
})

//handle DESTROY table
$('#destroyTable').click(function () {
  console.log('destroying');
  user.type = 'player'
  socket.emit('destroy')
})

// handle submission for joining the table
$('#joinTable').click(function () {
  // console.log(currentUserString)
  var currentUser = JSON.parse(currentUserString)
  user.name = currentUser.username
  user.credits = currentUser.credits
  console.log('Joining table with name: ', user.name)
  socket.emit('join', user)
})

//handle quit table
$('#quitTable').click(function () {
  console.log('quiting');
  socket.emit('quit')
})
//CHECK IF THERES A TABLE
socket.on('tableTrue', function(msg) {
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').text(msg))
})

socket.on('tableFalse', function(msg) {
  $('#create').removeClass('hidden')
  $('#messages').prepend($('<li>').text(msg))
})

// welcome message received from the server
socket.on('welcome', function (msg) {
  // enable the form and add welcome message
  $('#join').addClass('hidden')
  $('#quit').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + msg + '<strong>'))
})

// pls play again
socket.on('quit', function (msg) {
  $('#quit').addClass('hidden')
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + msg + '<strong>'))
})

// message broacast that banker created the table
socket.on('created', function (user) {
  console.log(user.name + ' created the table and is the banker.')
  $('#create').addClass('hidden')
  $('#join').removeClass('hidden')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' created the table and is the banker.' + '<strong> '))
})
// message to banker
socket.on('readyToPlay', function(msg) {
  $('#create').addClass('hidden')
  $('#destroy').removeClass('hidden')
  $('#bankerDeal').removeClass('hidden')
  $('#messages').prepend($('<li>').html(msg))
})
// banker destroyed table already
socket.on('destroyed', function(msg) {
  $('#create').removeClass('hidden')
  $('#bankerDeal').addClass('hidden')
  $('#destroy').addClass('hidden')
  $('#join').addClass('hidden')
  $('#quit').addClass('hidden')
  console.log('ive destroyed the table');
})

// message received that new user has joined the table
socket.on('joined', function (user) {
  console.log(user.name + ' joined the table.')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' joined the table.' + '<strong> '))
})
// handle leaving message
socket.on('left', function (user) {
  console.log(user.name + ' left the table.')
  $('#messages').prepend($('<li>').html('<strong>' + user.name + ' left the table.' + '<strong> '))
})

// keep track of who is ONLINE
socket.on('online', function (playersInGame) {
  var names = ''
  // console.log('playersInGame: ', playersInGame)
  for (var i = 0; i < playersInGame.length; ++i) {
    if (playersInGame[i].name) {
      if (i > 0) {
        if (i === playersInGame.length - 1) names += ' and '
        else names += ', '
      }
      names += playersInGame[i].name
    }
  }
  $('#messages').prepend($('<li>').text(names));
})

//Receiving money
socket.on('emitting Money', function(credits) {
  console.log('received money');
  $('#creditOnHand').html(credits)
})

//ON CLICK OF DEAL
 $('#deal').click(function() {
   socket.emit('deal cards') //Send Shuffled Deck Array to server
 });


socket.on('stop deal', function() {
  console.log('removing deal button');
  $('#deal').addClass('disabled')
})

// ON CLICK OF DRAW
$('#draw').click(function() {
  socket.emit('draw')
})
//STOP DRAW
socket.on('stop draw', function() {
  console.log('im back to disable draw');
  $('#draw').addClass('disabled')
})

//Receive cards
socket.on('oneCard', function(card) {
  console.log('card received is', card);
  $('#playerDraw').removeClass('hidden')
  $('#hand').append($("<img class ='column' id='card' src='images/Cards/" + card.face + " " + card.suit + ".png'/>"))

})

//Receive player object
socket.on('player', function(passedHand) {
  var playerHand = passedHand
  console.log('playerHand: ', playerHand);

  for (var prop in playerHand) {
    console.log(prop + ": " + playerHand[prop]);
    if (prop === "valueOfHand") {
      $('#playerObject').append($('<li>').text("Total Value: " + playerHand[prop]))
    }
    if (prop === "handType") {
      $('#playerObject').append($('<li>').text("Hand Type: " + playerHand[prop]))

    }
    if (prop === "payout") {
      $('#playerObject').append($('<li>').text("Payout: " + playerHand[prop] + "x"))

    }
  }
})

//Receive player object
socket.on('playerDraw', function(passedHand) {
  $('#playerObject').empty()

  var playerHand = passedHand
  console.log('playerHand: ', playerHand);

  for (var prop in playerHand) {
    console.log(prop + ": " + playerHand[prop]);
    if (prop === "valueOfHand") {
      $('#playerObject').append($('<li>').text("Total Value: " + playerHand[prop]))
    }
    if (prop === "handType") {
      $('#playerObject').append($('<li>').text("Hand Type: " + playerHand[prop]))

    }
    if (prop === "payout") {
      $('#playerObject').append($('<li>').text("Payout: " + playerHand[prop] + "x"))

    }
  }
})

//NEW ROUND
$('#newRound').click(function() {
  socket.emit('new')
})

//Clear previous cards and hands
socket.on('clear', function() {
  $('#hand').empty()
  $('#playerObject').empty()
  $('#deal').removeClass('disabled')
  $('#playerDraw').addClass('hidden')
  $('#draw').removeClass('disabled')
})

//BETTING element
$('#bet').dropdown(); //enable dropdown

$('#betAmt').change(function() {
  var placedBet = $('#betAmt').text()
  $('#currentBet').html(placedBet)
  socket.emit('placeBetAmt', placedBet)
})

socket.on('whoHasBetted', function (msg) {
  $('#messages').prepend($('<li>').html(msg))
})
