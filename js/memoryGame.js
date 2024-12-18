var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var started = false;
var score = 0;

$(document).keypress(function () {
    if (!started) {
        $("#score-title").text("Score " + score);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function () {

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

function checkAnswer(currentScore) {

    if (gamePattern[currentScore] === userClickedPattern[currentScore]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        gameOver();
    }
}


function nextSequence() {
    userClickedPattern = [];
    score++;
    $("#score-title").text("Score " + score);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}

function playSound(name) {
    var audio = new Audio("./data/sound/" + name + ".mp3");
    audio.play();
}

function startOver() {
    score = 0;
    gamePattern = [];
    started = false;
}

function gameOver(){
    localStorage.removeItem("currScore")
        localStorage.setItem("currScore", score);
        playSound("wrong");
        $("body").addClass("game-over");
        $("#score-title").text("Game Over!");
        $("#name-popup").show();
        $("#memoryscore").text("Score: " + score);

        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
}
