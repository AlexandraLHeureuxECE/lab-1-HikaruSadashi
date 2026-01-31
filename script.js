const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const themeToggleBtn = document.getElementById("themeToggle");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = [];
let currentPlayer = "X";
let isGameOver = false;
let winningCells = [];
let themeIndex = 0;

const themes = [
  { id: "classic", label: "Classic" },
  { id: "dark", label: "Dark" },
  { id: "cyberpunk", label: "Cyberpunk" },
];

function init() {
  board = Array(9).fill("");
  currentPlayer = "X";
  isGameOver = false;
  winningCells = [];
  renderBoard();
  updateStatus();
}

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.dataset.index = String(index);
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Cell ${index + 1}`);
    cell.textContent = value;

    if (winningCells.includes(index)) {
      cell.classList.add("winner");
    }

    boardEl.appendChild(cell);
  });
}

function updateStatus() {
  if (isGameOver && winningCells.length) {
    statusEl.textContent = `${currentPlayer} wins`;
    return;
  }
  if (isGameOver) {
    statusEl.textContent = "Draw";
    return;
  }
  statusEl.textContent = `${currentPlayer}'s turn`;
}

function handleMove(index) {
  if (isGameOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  const winner = checkWinner();
  if (winner) {
    isGameOver = true;
    winningCells = winner;
  } else if (board.every((cell) => cell)) {
    isGameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  renderBoard();
  updateStatus();
}

function checkWinner() {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) {
    return;
  }
  const index = Number(cell.dataset.index);
  handleMove(index);
});

restartBtn.addEventListener("click", init);

function applyTheme() {
  const theme = themes[themeIndex];
  document.body.dataset.theme = theme.id === "classic" ? "" : theme.id;
  themeToggleBtn.textContent = `Theme: ${theme.label}`;
}

function handleThemeToggle() {
  themeIndex = (themeIndex + 1) % themes.length;
  applyTheme();
}

themeToggleBtn.addEventListener("click", handleThemeToggle);

init();
applyTheme();
