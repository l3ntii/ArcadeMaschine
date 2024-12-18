let cells;
let currentPlayer;
let gameFinished;
let board;
let singlePlayer;

function init() { // speaks for itself initializes the game/required vars
    selectPlayMode();

    cells = document.querySelectorAll('.cell');
    currentPlayer = 'X';
    gameFinished = false;
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', makeMove);
    });
}

function selectPlayMode() { // determines if game is played in single/multi Player -> get Stored in singlePlayer boolean
    document.getElementById("game-container").style.display = "none";

    var dialogMode = document.querySelector('#dialog-gamemode');

    var singlePlayerBtn = document.getElementById('singlePlayer-btn');
    var multiPlayerBtn = document.getElementById('multiPlayer-btn');

    dialogMode.showModal();

    singlePlayerBtn.addEventListener('click', function (event) {
        event.preventDefault();
        singlePlayer = true;
        dialogMode.close();
        document.getElementById("game-container").style.display = "block";
    });

    multiPlayerBtn.addEventListener('click', function (event) {
        event.preventDefault();
        singlePlayer = false;
        dialogMode.close();
        document.getElementById("game-container").style.display = "block";
    });
}

function makeMove(e) { //player selects cell
    if (gameFinished) return;
    const cell = e.target;
    const row = parseInt(cell.dataset.row); //get exact location
    const col = parseInt(cell.dataset.col);

    if (board[row][col] !== '') return; //if cell is set -> try again

    cell.textContent = currentPlayer;
    cell.classList.add('nes-pointer');
    board[row][col] = currentPlayer;

    check(currentPlayer); //checks if game is finished

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; //next Player is the opposite of current basically

    if (singlePlayer) { //if in SinglePlayer Mode -> make Computer move (delay it for Simulation XD)
        setTimeout(() => {
            makeComputerMove();
        }, 400);

    }
}

function makeComputerMove() { //Computer makes next move (guessing)
    if (gameFinished) return;

    let emptyCells = [];
    for (let row = 0; row < 3; row++) { //check which cells are empty
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                emptyCells.push({row, col});
            }
        }
    }

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length); //choose randome cell
    const randomCell = emptyCells[randomIndex];

    const cellIndex = randomCell.row * 3 + randomCell.col;
    const cell = cells[cellIndex];

    cell.textContent = currentPlayer;
    cell.classList.add('nes-pointer');

    board[randomCell.row][randomCell.col] = currentPlayer;

    check(currentPlayer);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function check(player) { //check if the game is over
    if (checkWin()) {
        gameFinished = true;
        setTimeout(() => {
            gameOver('Player ' + player + ' wins!', false);
        }, 50);
        return;
    }

    if (checkDraw()) {
        gameFinished = true;
        setTimeout(() => {
            gameOver('It is a draw!', true);
        }, 50);

    }
}

function checkWin() { //check if any winning combination is present -> if winning combination is found returns true otherwise false
    const winningCombinations = [ //values represent array indices
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winningCombinations.some(combination => { //iterates through and checks if condition for any case is true
        const [a, b, c] = combination;
        const symbolA = board[Math.floor(a / 3)][a % 3];
        const symbolB = board[Math.floor(b / 3)][b % 3];
        const symbolC = board[Math.floor(c / 3)][c % 3];
        return (
            symbolA !== '' && //so all symbols needs to be set if next conditions are true
            symbolA === symbolB &&
            symbolB === symbolC
        );
    });
}

function checkDraw() { //check if game is tied
    return board.flat().every(cell => cell !== ''); //if game is not won, but all cells are set -> game is tied
}

function resetBoard() { //basically the opposite of init
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
    gameFinished = false;
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    selectPlayMode();
    document.getElementById("gameBoard").style.opacity = "1";
    document.getElementById("addToScoreboard").style.display = "none";
    document.getElementById("skipToScoreboard").style.display = "none";
    document.getElementById("viewScoreboard-btn").style.display = "none";
}

function gameOver(msg, isDraw) { //give user the possibility to add his name to the scoreboard if he wants
    var dialogGameOver = document.querySelector('#dialog-gameover');

    document.getElementById("result").innerText = msg;

    var restartBtn = document.getElementById('restart-btn');
    var skipToScoreboardBtn = document.getElementById('skipToScoreboard-btn');

    dialogGameOver.showModal();

    restartBtn.addEventListener('click', function (event) {
        event.preventDefault();
        dialogGameOver.close();
        resetBoard();
    });

    if (!isDraw) {
        skipToScoreboardBtn.style.display = "";

        skipToScoreboardBtn.addEventListener('click', function (event) {
            event.preventDefault();
            dialogGameOver.close();
            addToScoreboard();
        });
    } else {
        skipToScoreboardBtn.style.display = "none";
    }
}

function addToScoreboard() { //adds the user to the scoreboard
    var dialogScoreboard = document.querySelector('#dialog-addToScoreboard');
    var scoreboardBtn = document.getElementById("addToScoreboard-btn");
    var playerNameInput = document.getElementById("nameInput");

    dialogScoreboard.showModal();

    playerNameInput.addEventListener("input", function (event) {
        if (playerNameInput.value != null && playerNameInput.value != "") {
            scoreboardBtn.classList.remove("is-disabled");
            scoreboardBtn.classList.add("is-primary");
        } else {
            scoreboardBtn.classList.remove("is-primary");
            scoreboardBtn.classList.add("is-disabled");
        }
    });

    scoreboardBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (playerNameInput.value != null && playerNameInput.value != "") {
            setScores(playerNameInput.value, 4);
            scoreboardBtn.style.display = "none";
            document.getElementById("viewScoreboard-btn").style.display = "";
        }
    });
}