// ========== sudoku.js ========== //

let numSelected = null;
let tileSelected = null;
let errors = 0;
let timerInterval;
let secondsElapsed = 0;

let board = [];
let solution = [];

const puzzles = [
  {
    board: [
      "--74916-5",
      "2---6-3-9",
      "-----7-1-",
      "-586----4",
      "--3----9-",
      "--62--187",
      "9-4-7---2",
      "67-83----",
      "81--45---"
    ],
    solution: [
      "387491625",
      "241568379",
      "569327418",
      "758619234",
      "123784596",
      "496253187",
      "934176852",
      "675832941",
      "812945763"
    ]
  },
  {
    board: [
      "53--7----",
      "6--195---",
      "-98----6-",
      "8---6---3",
      "4--8-3--1",
      "7---2---6",
      "-6----28-",
      "---419--5",
      "----8--79"
    ],
    solution: [
      "534678912",
      "672195348",
      "198342567",
      "859761423",
      "426853791",
      "713924856",
      "961537284",
      "287419635",
      "345286179"
    ]
  }
];

window.onload = () => {
  const initial = puzzles[Math.floor(Math.random() * puzzles.length)];
  board = initial.board;
  solution = initial.solution;
  setGame();
  startTimer();

  document.getElementById("resetBtn").addEventListener("click", resetGame);
  document.getElementById("newPuzzleBtn").addEventListener("click", newPuzzle);
  document.getElementById("toggleDarkMode").addEventListener("click", toggleDarkMode);
  document.getElementById("hintBtn").addEventListener("click", giveHint);
};

function setGame() {
  document.getElementById("digits").innerHTML = "";
  document.getElementById("board").innerHTML = "";

  for (let i = 1; i <= 9; i++) {
    const number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      if (board[r][c] !== "-") {
        tile.innerText = board[r][c];
        tile.classList.add("tile-start");
      }
      if (r === 2 || r === 5) tile.classList.add("horizontal-line");
      if (c === 2 || c === 5) tile.classList.add("vertical-line");
      tile.addEventListener("click", selectTile);
      tile.classList.add("tile");
      document.getElementById("board").appendChild(tile);
    }
  }

  errors = 0;
  document.getElementById("errors").innerText = errors;
}

function selectNumber() {
  if (numSelected) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

function selectTile() {
  if (!numSelected || this.innerText !== "") return;

  const [r, c] = this.id.split("-").map(Number);
  const correct = solution[r][c] === numSelected.id;

  if (correct) {
    this.innerText = numSelected.id;
    this.classList.add("correct");
    const sound = document.getElementById("correctSound");
    if (sound) sound.play();
  } else {
    this.classList.add("shake");
    setTimeout(() => this.classList.remove("shake"), 300);
    errors++;
    document.getElementById("errors").innerText = errors;
    const sound = document.getElementById("errorSound");
    if (sound) sound.play();
  }
}

function resetGame() {
  errors = 0;
  secondsElapsed = 0;
  clearInterval(timerInterval);
  const currentBoard = [...board];
  const currentSolution = [...solution];
  board = currentBoard;
  solution = currentSolution;
  setGame();
  startTimer();
}

function newPuzzle() {
  const random = puzzles[Math.floor(Math.random() * puzzles.length)];
  board = random.board;
  solution = random.solution;
  resetGame();
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const toggleBtn = document.getElementById("toggleDarkMode");
  if (body.classList.contains("dark-mode")) {
    toggleBtn.innerText = "Toggle light mode";
  } else {
    toggleBtn.innerText = "Toggle dark mode";
  }
}

function giveHint() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      if (tile.innerText === "") {
        tile.innerText = solution[r][c];
        tile.classList.add("correct");
        return;
      }
    }
  }
}

function startTimer() {
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
    const seconds = String(secondsElapsed % 60).padStart(2, "0");
    timerEl.innerText = `Time: ${minutes}:${seconds}`;
  }, 1000);
}