const startBtn = document.querySelector("#start"),
  screens = document.querySelectorAll(".screen"),
  timer = document.querySelector("#timer"),
  difficultyLevel = document.querySelector("#difficulty"),
  timeEl = document.querySelector("#time"),
  board = document.querySelector("#board"),
  hitsEl = document.querySelector("#hits"),
  accuracyEl = document.querySelector("#accuracy"),
  hitsOverEl = document.querySelector("#hits-over"),
  accuracyOverEl = document.querySelector("#accuracy-over"),
  life = document.querySelectorAll(".life"),
  dead = document.querySelectorAll(".dead"),
  restartBtns = document.querySelectorAll(".restart"),
  fullScreenBtn = document.querySelector("#fullscreen"),
  minimizeBtn = document.querySelector("#minimize");

let time = 0,
  unlimited = false,
  difficulty = 0,
  playing = false,
  hits = 0,
  missed = 0,
  accuracy = 0,
  interval;

//When startgame click screen procede to timer screen
startBtn.addEventListener("click", () => {
  screens[0].classList.add("up");
});

//When clicked the screen goes up to the difficulty screen
timer.addEventListener("click", (e) => {
  if (e.target.classList.contains("time-btn")) {
    time = parseInt(e.target.getAttribute("data-time"));
    unlimited = e.target.getAttribute("data-unlimited");
    screens[1].classList.add("up");
  }
});

//Choosing Difficulty then start game
difficultyLevel.addEventListener("click", (e) => {
  if (e.target.classList.contains("difficulty-btn")) {
    difficulty = parseInt(e.target.getAttribute("data-difficulty"));
    screens[2].classList.add("up");
    startGame();
  }
});

//Start game
function startGame() {
  for (let i = 0; i < 3; i++) {
    life[i].classList.remove("dead");
  }
  playing = true;
  interval = setInterval(decreaseTime, 1000);
  createRandomCircle();

  if (difficulty === 4) {
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        createRandomCircle();
      }
    }, 10000); // Add 2 circles after 10 seconds
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        createRandomCircle();
      }
    }, 20000); // Add 3 circles after 20 seconds
  }

  if (difficulty === 3) {
    const durations = ["2s", "1s"];
    let interval = 2000; // Initial interval

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        setAnimationDuration(durations[i % 2]);
      }, interval);

      // Update the interval for the next setTimeout
      interval += 2000; // Alternate between 2s and 1s
    }
  }
}

// Running the timer
function decreaseTime() {
  //When unlimited timer is selected
  if (unlimited) {
    setTime("∞");
    return;
  }
  //game over when timer reach 0
  if (time === 0) {
    finishGame();
  }
  let current = --time;
  let ms = time * 1000;
  let mins = Math.floor(ms / (1000 * 60));
  let secs = Math.floor((ms % (1000 * 60)) / 1000);

  //add trailing zero
  secs = secs < 10 ? "0" + secs : secs;
  mins = mins < 10 ? "0" + mins : mins;

  setTime(`${mins}:${secs}`);
}

function setTime(time) {
  timeEl.innerHTML = time;
}

function createRandomCircle() {
  //playing false do nothing
  if (!playing) {
    return;
  }

  const circle = document.createElement("div");
  const size = getRandomNumber(50, 120);
  const colors = ["#03DAC6", "#FF0266", "#b3ff00", "#ccff00", "#9D00FF"];

  const { width, height } = board.getBoundingClientRect();
  const x = getRandomNumber(0, width - size);
  const y = getRandomNumber(0, height - size);

  circle.classList.add("circle");
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  circle.style.top = `${y}px`;
  circle.style.left = `${x}px`;

  let color = Math.floor(Math.random() * 5);
  circle.style.background = `${colors[color]}`;
  board.append(circle);

  //Dificulty level settings
  if (difficulty === 1) {
    circle.style.animationDuration = "3s";
  } else if (difficulty === 2) {
    circle.style.animationDuration = "2.5s";
  } else if (difficulty === 3) {
    circle.style.animationDuration = "2s";
  } else {
    circle.style.animationDuration = "2s";
  }

  //create new circle when current disappears
  circle.addEventListener("animationend", () => {
    circle.remove();
    createRandomCircle();

    //if circle dissapears before clicked its counted as a miss
    addMissed();
    //recalculate accuracy
    calculateAccuracy();
  });

  //add event when circle is clicked
  board.addEventListener("click", (e) => {
    if (e.target.classList.contains("circle")) {
      if (e.target === circle) {
        //increase hits by 1
        hits++;
        //remove circle
        e.target.remove();
        //create new circle
        createRandomCircle();
      }
    } else {
      //circle missed when clicked
      missed++;
    }
    //show hits on document
    hitsEl.innerHTML = hits;
    //add accuracy on document
    calculateAccuracy();
  });
}

function setAnimationDuration(duration) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    circle.style.animationDuration = duration;
  });
}

function calculateAccuracy() {
  accuracy = (hits / (hits + missed)) * 100;
  accuracy = accuracy.toFixed(2);
  accuracyEl.innerHTML = `${accuracy}%`;
}

//get a random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function finishGame() {
  playing = false;
  clearInterval(interval);
  board.innerHTML = "";
  screens[3].classList.add("up");
  hitsEl.innerHTML = 0;
  timeEl.innerHTML = "00:00";
  accuracyEl.innerHTML = "0%";

  //update stats when game over
  hitsOverEl.innerHTML = hits;
  accuracyOverEl.innerHTML = `${accuracy}%`;
}

// Decreasing Lives when missed
function addMissed() {
  //Verify how many life remaining
  if (
    life[0].classList.contains("dead") &&
    life[1].classList.contains("dead") &&
    life[2].classList.contains("dead")
  ) {
    finishGame();
  } else {
    missed++;
    //remove a heart when missed
    for (let i = 0; i < life.length; i++) {
      if (!life[i].classList.contains("dead")) {
        life[i].classList.add("dead");
        break; //break after adding to one dont add to others
      }
    }
  }
}

restartBtns.forEach((btn) => {
  btn.addEventListener("click", restartGame);
});

function restartGame() {
  finishGame();
  screens[1].classList.remove("up");
  screens[2].classList.remove("up");
  screens[3].classList.remove("up");
  time = 0;
  unlimited = false;
  difficulty = 0;
  playing = false;
  hits = 0;
  missed = 0;
  accuracy = 0;
  for (let i = 0; i < 3; i++) {
    life[i].classList.remove("dead");
  }
}

fullScreenBtn.addEventListener("click", fullScreen);

let el = document.documentElement;

function fullScreen() {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else {
    fullScreenBtn.style.display = "none";
    minimizeBtn.style.display = "block";
  }
}

minimizeBtn.addEventListener("click", minimize);

function minimize() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else {
    minimizeBtn.style.display = "none";
    fullScreenBtn.style.display = "block";
  }
}
