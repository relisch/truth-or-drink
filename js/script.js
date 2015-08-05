/*	
	Should be complete.
*/

var players = new Array(), count = 0, gameStarted = false;

$(document).ready(function() {
	$('#questionCount').text(questions.length + 1);

	// Initial player creation listeners
	$('#btnAddPlayerField').on('click', function(){
		addPlayerField();
	});

	$('#btnRemovePlayerField').on('click', function(){
		removePlayerField();
	});

	// Lightbox button listeners
	$('#btnSubmitQuestions').on('click', function(){
		addQuestions();
	});

	$('#btnSubmitAddPlayers').on('click', function(){
		addPlayers();
	});

	$('#btnSubmitRemovePlayers').on('click', function(){
		removePlayers();
	});

	$('#btnShowQuestions').on('click', function(){
		if($('#list').hasClass('hide')){
			showQuestions();
		}
		else {
			$('#list').html('');
			$('#list').addClass('hide');
		}
	});

	$('#btnGo').on('click', function(){
		startGame();
	});

});

// Get all the names the user put in and start the game
function populateNames() {
	$('.playerField').each(function(i){
		if($(this).val() != '') {
			players.push($(this).val());
			$(this).val('');
		}
	});
}

// Change UI to show question screen
function startGame() {
	$('#people').hide();
	$('.col-md-4').hide();
	populateNames();
	updateRemovePlayers();

	// Shuffle the array of questions so we can iterate through
	for (var i = questions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }
    gameStarted = true;

    $('#question').removeClass('hide');
    $('#btnAddPlayers').removeClass('hide');
    $('#btnRemovePlayers').removeClass('hide');
    next();
}

// Add an input to the homepage to enter another player name
function addPlayerField() {
	$('<input type="text" class="playerField form-control" placeholder="Player Name">').appendTo($('#players'));
}

// Remove an input from the list of player names
function removePlayerField() {
	$('.playerField:last-of-type').remove();
}

// Get a random name from the list of players. CANNOT be the person who just answered
function getName() {
	var tempName = $('#questionText').text(), name = 'NAME', cont = true;
	var prevName = tempName.substring(0, tempName.indexOf(','));
	while(cont) {
		name =  players[Math.floor(Math.random() * players.length)];
		if(name != prevName) {
			cont = false;
		}
	}
	return name;
}

// Get the next question from the list and pick another person to answer it
function next() {
	$('#list').hide();
	if(count == questions.length) {
		count = 0;
		startGame();
	}
	if((Math.random() * 1,000) + 1 == 666) {
		var name = getName();
		$('#questionText').text(name + ', ' + "Strip to your underwear or take 4 shots.");
		return;
	}
	var name = getName();
	$('#questionText').text(name + ', ' + questions[count]);
	count++;
}

// Add this question to the list at a later point that's at least one full rotation in the future
function drink() {
	$('#list').hide();
	var index = 0;
	while(index <= count + players.length) {
		index = Math.floor(Math.random() * questions.length);
	}
	questions.splice(index, 0, questions[count-1]);
	next();
}

// Show a list of all the questions
function showQuestions() {
	$('#list').html('<h2>All Questions</h2>');
	$('<ul class="list-group">').appendTo($('#list'));
	for(var i = 0; i < questions.length; i++) {
		$('<li class="list-group-item">'+ questions[i] +'</li>').appendTo($('#list'));
	}
	$('</ul>').appendTo($('#list'));
	$('#list').removeClass('hide');
}

// Add questions to the array for the duration of this session
function addQuestions() {
	$('.questionField').each(function(){
		if($(this).val()) {
			if(!gameStarted) {
				questions.push($(this).val());
			}
			else {
				var i = questions.length;
				var j = -1;
				while(j <= (count + 5)) {
					j = Math.floor((Math.random() * i) + 1);
				}
				questions.splice(j,0,$(this).val());
				$(this).val('');
			}
		}
	});

	$('#questionCount').text(questions.length + 1);
	var current = $.featherlight.current()
	current.close();
}

function addPlayers() {
	$('.lbPlayerField').each(function() {
		if($(this).val()) {
			players.push($(this).val());
			$(this).val('');
		}
	});
	updateRemovePlayers();
	var current = $.featherlight.current()
	current.close();
}

function updateRemovePlayers() {
	$('#removePlayerList').html('');
	$(players).each(function(i, val) {
		$('<li class="list-group-item">'+val+'<span class="right"><input type="checkbox" value="'+i+'"></span></li>').appendTo('#removePlayerList');
	})
}

function removePlayers() {
	$('#removePlayerList > li > span > input:checked').each(function() {
		players.splice($(this).val(), 1);
		console.log(players[$(this).val()]);
	});

	updateRemovePlayers();
	var current = $.featherlight.current()
	current.close();
}