// global variables
var userScores;

// utility functions
var sortByScoreProgress = function(scoresList){
	scoresList.sort(function(a, b){return (b.currentScore - b.previousWeekScore) - (a.currentScore - a.previousWeekScore)});
}
var getScoreProgress = function(sortedList){
	var list = [];
	for (var i=0; i < sortedList.length; i++){
		list.push(sortedList[i].currentScore - sortedList[i].previousWeekScore);
	}
	return list;
}
var getUserIndex = function(scoresList, name){
	for (var i=0; i < scoresList.length; i++){
		if (scoresList[i].name == name){
			return i;
		}
	}
	return null;
}
var updateLeaderboard = function(data){
	$("#leaderboard").empty();

	sortByScoreProgress(data);
	var weeklyProgressScores = getScoreProgress(data);
	for (var i=0; i < data.length; i++){
		$("#leaderboard").append("<li>" + data[i]["name"] + " " + weeklyProgressScores[i] + "</li>");
	}
}

// Get current scores data from myjson.com API -- occurs on page load
$.get("https://api.myjson.com/bins/49dtq", function(data, textStatus, jqXHR){
	userScores = data;
	updateLeaderboard(data);

});

// update a user's score -- occurs on form submission
$( "form" ).on( "submit", function( event ) {
	event.preventDefault();
	timeClicked = new Date();

	var userInput, userFormatted;
  	userInput = $( this ).serializeArray();

	userFormatted = {
		name: userInput[0]["value"],
		currentScore: Number(userInput[1]["value"]),
		previousWeekScore: 0
	}


	var userIndex = getUserIndex(userScores, userFormatted.name);

	// check if user already exists
	if (userIndex != null){
		userScores[userIndex].previousWeekScore = userScores[userIndex].currentScore;
		userScores[userIndex].currentScore = userFormatted.currentScore;
	} else {
		// create new user
		userScores.push(userFormatted);
	}

	updateLeaderboard(userScores);

	// upload new scores to myjson API
	$.ajax({
	    url:"https://api.myjson.com/bins/49dtq",
	    type:"PUT",
	    data: JSON.stringify(userScores),
	    contentType:"application/json; charset=utf-8",
	    dataType:"json",
	    success: function(data, textStatus, jqXHR){
	    }
	});
});
