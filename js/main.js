var players = [];
var storedData;
var playersData

$(document).ready(function () {
    storedData = localStorage.getItem("players");
    playersData = JSON.parse(storedData);

    function displayPlayerData() {
        if (playersData != null) {
            playersData.forEach(function (player) {
                var row = $("<tr>");
                var nameCell = $("<td>").text(player.name);
                var scoreCell = $("<td>").text(player.score);
                row.append(nameCell, scoreCell);
                $(".player-table").append(row);
            });
        }
    }

    displayPlayerData();

    $("#reset-scores").click(() => {
        localStorage.clear();
        location.reload();
    });

    $("#again-btn-jump").click(function () {
        jumpGameOver();
        location.reload();
    });

    $("#home-btn-jump").click(function () {
        jumpGameOver();
        window.location.href = "./Frontpage.html";
    });

    $("#again-btn-memory").click(function () {
        memoryGameOver();
        location.reload();
    });

    $("#home-btn-memory").click(function () {
        memoryGameOver();
        window.location.href = "./Frontpage.html";
    });
});

function jumpGameOver() {
    var playerName = $("#name-input-jump").val();
    var playerscore = parseInt(localStorage.getItem("currScore"));
    setScores(playerName, playerscore);
}

function memoryGameOver() {
    var playerName = $("#name-input-memory").val();
    var playerscore = parseInt(localStorage.getItem("currScore"));
    setScores(playerName, playerscore);
}

//TicTacToe triggers setScores directly in its addToScoreboardFunction..

function setScores(playerName, playerscore){
    var added = false;
    players.forEach(player => {
        if (player.name === playerName) {
            player.score += playerscore;
            added = true;
        }
    });

    if (!added) {
        players.push({ name: playerName, score: playerscore });
    }

    var storedData = localStorage.getItem("players");
    var playersData = JSON.parse(storedData);

    if (playersData != null) {
        players.forEach(player => {
            var added2 = false;
            playersData.forEach(player2 => {
                if (player2.name === player.name) {
                    player2.score += player.score;
                    added2 = true;
                }
            });
            if (!added2) {
                playersData.push({ name: player.name, score: player.score });
            }
        });
    } else {
        playersData = players;
    }

    localStorage.setItem("players", JSON.stringify(playersData));
}