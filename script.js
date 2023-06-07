document.addEventListener("DOMContentLoaded", function() {
  const cvs = document.getElementById("canvas");
  const ctx = cvs.getContext("2d");

  const bird = new Image();
  const pipeUp = new Image();
  const pipeBottom = new Image();
  const fg = new Image();
  const bg = new Image();

  bird.src = "./img/bird3-1.png";
  pipeUp.src = "./img/flappy_bird_pipeUp.png";
  pipeBottom.src = "./img/flappy_bird_pipeBottom.png";
  fg.src = "./img/flappy_bird_fg.png";
  bg.src = "./img/background2.png";

  const fly = new Audio();
  const score_audio = new Audio();

  fly.src = "./sound/fly.mp3";
  score_audio.src = "./sound/score.mp3";

  const gap = 90;

  let pipes = [];
  let score = 0;
  let xPos, yPos, velocity, gravity;

  function moveUp() {
    velocity = -4;
    fly.play();
  }

  function touchHandler(e) {
    e.preventDefault();
    moveUp();
  }

  function init() {
    document.addEventListener("keydown", moveUp);
    cvs.addEventListener("touchstart", touchHandler);
    resetGame();
    setInterval(update, 20);
  }

  function resetGame() {
    pipes = [];
    pipes.push({
      x: cvs.width,
      y: 0
    });
    score = 0;
    xPos = 10;
    yPos = 150;
    velocity = 0;
    gravity = 0.2;
  }

  function update() {
    if (gameOver) {
      return;
    }

    moveBird();
    movePipes();
    draw();
    checkCollision();
    updateScore();
  }

  function moveBird() {
    velocity += gravity;
    yPos += velocity;
  }

  function movePipes() {
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x--;
      if (pipes[i].x === 90) {
        pipes.push({
          x: cvs.width,
          y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
        });
      }
    }
    if (pipes[0].x + pipeUp.width === 0) {
      pipes.shift();
    }
  }

  function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipes.length; i++) {
      ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
      ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    ctx.fillStyle = "#000";
    ctx.font = "24px Verdana";
    ctx.fillText("Счет: " + score, 10, cvs.height - 20);
  }

  let gameOver = false;

  function checkCollision() {
    if (gameOver) {
      return;
    }

    for (let i = 0; i < pipes.length; i++) {
      if (
        xPos + bird.width >= pipes[i].x &&
        xPos <= pipes[i].x + pipeUp.width &&
        (yPos <= pipes[i].y + pipeUp.height ||
          yPos + bird.height >= pipes[i].y + pipeUp.height + gap) ||
        yPos + bird.height >= cvs.height - fg.height
      ) {
        gameOver = true;
        showGameOver();
      }
    }
  }

  function updateScore() {
    if (pipes[0].x === 5) {
      score++;
      score_audio.play();
    }
  }

  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", restartGame);

  function restartGame() {
    resetGame();
    document.getElementById("game-over").style.display = "none";
    gameOver = false;
  }

  function showGameOver() {
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = "Счет: " + score;
    document.getElementById("game-over").style.display = "block";
  }

  bird.onload = function() {
    init();
  };
});

