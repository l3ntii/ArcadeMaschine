$(document).ready(function () {
    var player = $("#player");
    var playerHeight = player.height();
    var jumping = false;
    var jumpHeight = 150;
    var jumpDuration = 400;
    var obstacleTimeout;
    var gameAreaWidth = $(window).width();
    var gameAreaHeight = $(window).height();
    var gameOver = false;
    var obstacleSpeed;
    var obstacleDelay;
    var score = 0;
    var obstacles = [];
    var score = 0;
    var soundPlayed = false;
    var levelPopup = $("#level-popup");
    var easyBtn = $("#easy-btn");
    var mediumBtn = $("#medium-btn");
    var hardBtn = $("#hard-btn");
    var restartBtn = $("#restart-btn");

    // showing the Level popup window at the first time
    levelPopup.show();


    // setting the speed, based ont the level

    easyBtn.click(function () {
        levelPopup.hide();
        obstacleSpeed = 3000;
        obstacleDelayMin = 500;
        obstacleDelayMax = 2000;
        startGame();
    });

    mediumBtn.click(function () {
        levelPopup.hide();
        obstacleSpeed = 2000;
        obstacleDelayMin = 500;
        obstacleDelayMax = 1500;
        startGame();
    });

    hardBtn.click(function () {
        levelPopup.hide();
        obstacleSpeed = 1400;
        obstacleDelayMin = 500;
        obstacleDelayMax = 1000;
        startGame();
    });

    //-----------------------------------

    // restarting the game once the restart button gets clicked
    restartBtn.click(restartGame);

    // calling some ohter functoin to start the game
    function startGame() {
        soundPlayed = false;
        scheduleNextObstacles();
        setInterval(function () {
            var obstacles = $(".obstacle");
            obstacles.each(function () {
                checkCollision($(this));
            });
        }, 0.1);
        createStars();
        moveStars();
    }

    function jump() {
        if (!jumping && !gameOver) {
            jumping = true;
            player.stop().animate({
                top: "-=" + jumpHeight
            }, jumpDuration / 2)
                .animate({
                    top: "+=" + jumpHeight
                }, jumpDuration / 2, function () {
                    jumping = false;
                });
        }
    }


    function generateObstacles() {
        if (!gameOver) {
            var obstacle = $("<div></div>").addClass("obstacle").css({
                left: gameAreaWidth,
                bottom: 0
            });
            $("body").append(obstacle);
            obstacles.push(obstacle);

            obstacle.animate(
                {
                    left: "-100%"
                },
                obstacleSpeed,
                "linear",
                function () {
                    if (!gameOver) {
                        $(this).remove();
                    }
                }
            );
            checkCollision(obstacle);
            score++;
            updateScore();
            scheduleNextObstacles();
        }
    }

    // Stop animating obstacles when the game is over
    function stopObstacleAnimations() {
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].stop();
        }
    }

    function createStars() {
        var starCount = 100; // Number of stars to generate
        var gameContainer = $("#game-container");
        var gameContainerWidth = gameContainer.width();
        var gameContainerHeight = gameContainer.height();

        for (var i = 0; i < starCount; i++) {
            var star = $("<div></div>").addClass("star");
            var starSize = Math.random() * 3 + 1; // Random size between 1 and 4
            var starPositionLeft = Math.random() * gameContainerWidth;
            var starPositionTop = Math.random() * gameContainerHeight;

            star.css({
                width: starSize + "px",
                height: starSize + "px",
                left: starPositionLeft + "px",
                top: starPositionTop + "px",
            });

            gameContainer.append(star);
        }
    }


    function moveStars() {
        var starCount = 100; // Number of stars
        var gameContainer = $("#game-container");
        var gameContainerWidth = gameContainer.width();

        var stars = $(".star"); // Store the stars in a variable

        stars.each(function () {
            var star = $(this);
            var starSpeed = Math.random() * 5 + 1; // Random speed between 1 and 6
            var starPositionLeft = star.position().left;

            star.animate({
                left: "-=" + (gameContainerWidth + 10) + "px"
            }, starSpeed * 1000, "linear", function () {
                if (!gameOver) {
                    star.css("left", gameContainerWidth + "px");
                    moveStars();
                }
            });
        });
    }


    function checkCollision(obstacle) {
        var playerPos = player.position();
        var obstaclePos = obstacle.position();
        var obstacleWidth = obstacle.width();
        var obstacleHeight = obstacle.height();

        var playerBottomLeft = {
            x: playerPos.left,
            y: playerPos.top + playerHeight
        };

        var obstacleTopRight = {
            x: obstaclePos.left + obstacleWidth,
            y: obstaclePos.top
        };

        if (
            playerBottomLeft.x < obstacleTopRight.x &&
            playerBottomLeft.y > obstaclePos.top &&
            playerPos.left + player.width() > obstaclePos.left &&
            playerPos.top < obstaclePos.top + obstacleHeight
        ) {
            gameOver = true;
            clearTimeout(obstacleTimeout);
            showGameOverPopup();
            $(".obstacle").stop(); // Stop the animation of existing obstacles
            obstacle.addClass("collided"); // Add collided class to the obstacle
            $(".obstacle").addClass("collided"); // Add collided class to all obstacles
        }
    }

    // This funcitons is called in generateObstacles to schedule the next obstacles
    function scheduleNextObstacles() {
        obstacleDelay = getRandomDelay(obstacleDelayMin, obstacleDelayMax);
        obstacleTimeout = setTimeout(() => {
            generateObstacles();
        }, obstacleDelay);
    }

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Updating the score text i the html
    function updateScore() {
        $("#score-level").text("Score: " + score);
    }

    // doing some stuff after the game is over
    function showGameOverPopup() {
        if (gameOver && !soundPlayed) {
            soundPlayed = true;
            playSound('./data/sound/wrong.mp3');
            stopObstacleAnimations();
            $("#name-popup").show();
            $("#jumpscore").text("Score: " + score);
            localStorage.removeItem("currScore")
            localStorage.setItem("currScore", score);
        }
    }


    function restartGame() {
        location.reload();
    }


    $(document).keydown(function (event) {
        if (event.keyCode === 32) {
            jump();
            playSound('./data/sound/Menu_Navigate_01.mp3');
        }
    });


    function playSound(path) {
        var sound = new Audio(path);
        sound.play();
    }
});
