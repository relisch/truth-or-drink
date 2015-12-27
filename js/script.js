/*	
	WORKING VERSION
*/

var players = new Array(), count = 0, playerCount = 0, gameStarted = false;

// Set listeners 
$(document).ready(function() {
	questions = fullQuestions;
	displayQuestions = questions.slice(0)
	//checkList();
	$('#questionCount').text(displayQuestions.length + 1);

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

	$('#btnTruth').on('click', function(){
		next();
		$(this).attr('disabled',true);
		setTimeout(function(){$('#btnTruth').attr('disabled', false)},1000);
	});

	$('#btnDrink').on('click', function(){
		drink();
		$(this).attr('disabled',true);
		setTimeout(function(){$('#btnDrink').attr('disabled', false)},1000);
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
			if($(this).val() == "party" || $(this).val() == "Party") {
				questions = partyQuestions;
				displayQuestions = questions.slice(0);
				$('#questionCount').text(displayQuestions.length + 1);
			} else {
				players.push($(this).val());
			}
			$(this).val('');
		}
	});
}

// Change UI to show question screen
function startGame() {
	$('#people').addClass('hide');
	$('.col-md-4').hide();
	populateNames();
	updateRemovePlayers();

	shuffleArray(questions);
	shuffleArray(questions);
	shuffleArray(questions);
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

// Mix up an array (param)
function shuffleArray(array) {
	// Shuffle the array of questions so we can iterate through
	for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Get the next question from the list and choose another person to answer it based on the round robin
function next() {
	$('#list').addClass('hide');

	if(count == questions.length) {
		count = 0;
		startGame();
	}
	
	// Reshuffle the array and make sure that the last person that went in the last round is not the 
	// first person in the new round. 
	if(playerCount == (players.length) || count == 0) {
		var lastPlayer = players[players.length -1];
		var cont = true;
		while(cont) {
			shuffleArray(players);
			players[0] == lastPlayer ? cont = true : cont = false;
		}
		playerCount = 0;
	}
	
	var name = players[playerCount];
	$('#questionText').text(name + ', ' + questions[count]);
	count++;
	playerCount++;
}

// Add this question to the list at a later point that's at least one full rotation in the future
function drink() {
	$('#list').addClass('hide');
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
	for(var i = 0; i < displayQuestions.length; i++) {
		$('<li class="list-group-item">'+ displayQuestions[i] +'</li>').appendTo($('#list'));
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

	$('#questionCount').text(displayQuestions.length + 1);
	var current = $.featherlight.current()
	current.close();
}

// Add one or more players to the game
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

// Update the "remove players" lightbox
function updateRemovePlayers() {
	$('#removePlayerList').html('');
	$(players).each(function(i, val) {
		$('<li class="list-group-item">'+val+'<span class="right"><input type="checkbox" value="'+i+'"></span></li>').appendTo('#removePlayerList');
	})
}

// remove one or more players from the game
function removePlayers() {
	$('#removePlayerList > li > span > input:checked').each(function() {
		var remName = $('#removePlayerList > li:eq(' + $(this).val() + ')').text();
		var index = players.indexOf(remName);
		players.splice(index, 1);
	});

	updateRemovePlayers();
	var current = $.featherlight.current()
	current.close();

	// Reset the players and go to the next question
	playerCount = players.length; 
	next();
}

// check the question list to make sure there weren't any input errors (duplicate questions)
function checkList() {
	var repeats = new Array();
	for(var i = 0; i < questions.length; i++) {
		var temp = questions[i];
		console.log('checking question ' + i);
		for(var j = 0; j < questions.length; j++) {
			if(temp == questions[j] && i != j && repeats.indexOf(j) == -1) {
				alert("Question " + j + ": "+ questions[j]+" is a repeat of question " + i + " " + questions[i]);
				repeats.push(i);
			}
		}
	}
	if(repeats.length == 0) {
		console.log('No duplicate questions!');
	}
}

function hideJumbo() {
	$('#titleJumbo').slideUp();
	$('#titleCompact').slideDown();
}

function showJumbo() {
	$('#titleCompact').slideUp();
	$('#titleJumbo').slideDown();
}