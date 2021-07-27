import Cell from "./cell.js";

const gridContainer = document.getElementById("grid");
const safeCellsContainer = document.getElementById("safeCells");
const flaggedCellsContainer = document.getElementById("flaggedCells");
const overlay = document.getElementById("overlay");
const gameEndModal = document.getElementById('gameEndModal');
const modalText = document.getElementById("modalText");
const playAgainButton = document.getElementById("playAgain");
const instructionsModal = document.getElementById('instructionsModal');
const showInstructionsButton = document.getElementById('howToPlay');
const hideInstructionsButton = document.getElementById('closeInstructions');

export const game = {};

game.init = () => {
  game.hideModal();
  game.numberOfMines = 15;
  game.firstButtonClicked = false;
  game.grid = game.buildGrid(10, 10);
  game.emptyGrid();
  game.displayGrid(game.grid);
  game.placeMines(game.numberOfMines);
  game.remainingSafeCells = 100 - game.numberOfMines;
  game.showSafeCellsRemaining();
  game.flaggedCells = 0;
  game.showFlaggedCells();
};

game.emptyGrid = () => {
  gridContainer.replaceChildren();
};

game.buildGrid = (rows, columns) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      const cell = new Cell(i, j);
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
};

game.displayGrid = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = game.grid[i][j];
      const button = document.createElement("button");
      button.classList.add("grid-cell");
      button.dataset.row = i;
      button.dataset.column = j;

      button.addEventListener("click", cell.handleClick.bind(cell));
      button.addEventListener("contextmenu", cell.handleFlag.bind(cell));

      gridContainer.appendChild(button);
    }
  }
};

game.placeMines = (number) => {
  let cells = game.grid.flat();
  let i = 0;
  while (i < number) {
    const randomCell = cells[Math.floor(Math.random() * cells.length)];
    const selectedCell = game.grid[randomCell.row][randomCell.column];
    if (!selectedCell.mine && selectedCell.covered) {
      selectedCell.mine = true;
      i++;
    }
  }
};

game.showSafeCellsRemaining = () => {
  safeCellsContainer.textContent = game.remainingSafeCells;
};

game.showFlaggedCells = () => {
  flaggedCellsContainer.textContent = game.flaggedCells;
};

game.revealMines = () => {
  const elements = Array.from(gridContainer.children);
  elements.forEach((element) => {
    if (game.grid[element.dataset.row][element.dataset.column].mine) {
      element.textContent = "💣";
    }
    if (window.innerWidth < 420) {
      element.style.fontSize = '12px';
    }
  });
};

game.checkWin = () => {
  if (game.remainingSafeCells === 0) {
    game.showModal("WIN");
  }
};

game.showModal = (condition) => {
  overlay.classList.remove("hidden");
  gameEndModal.classList.remove("hidden");
  if (condition === "WIN") {
    modalText.textContent = "Congratulations, you win!";
  } else if (condition === "LOSE") {
    modalText.textContent = "Oh no! You lose!";
  }
};

game.showInstructions = () => {
  overlay.classList.remove("hidden");
  instructionsModal.classList.remove("hidden");
}

game.hideModal = () => {
  overlay.classList.add("hidden");
  gameEndModal.classList.add("hidden");
  instructionsModal.classList.add("hidden");
};

playAgainButton.addEventListener("click", game.init);
showInstructionsButton.addEventListener("click", game.showInstructions);
hideInstructionsButton.addEventListener("click", game.hideModal);

game.init();
game.showInstructions();
