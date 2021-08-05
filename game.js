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


class Game {
  constructor() {
    this.numberOfMines = 15;
    this.firstButtonClicked = false;
    this.remainingSafeCells = 100 - this.numberOfMines;
    this.flaggedCells = 0;
    this.grid = [];
  };

  init = () => {
    playAgainButton.addEventListener("click", this.reset);
    showInstructionsButton.addEventListener("click", this.showInstructions);
    hideInstructionsButton.addEventListener("click", this.hideModal);
  };

  reset = () => {
    this.hideModal();
    this.emptyGrid();
    this.firstButtonClicked = false;
    this.grid = this.buildGrid(10, 10);
    this.displayGrid(this.grid);
    this.placeMines(this.numberOfMines);
    this.remainingSafeCells = 100 - this.numberOfMines;
    this.showSafeCellsRemaining();
    this.flaggedCells = 0;
    this.showFlaggedCells();
  };

  emptyGrid = () => {
    gridContainer.replaceChildren();
  };

  buildGrid = (rows, columns) => {
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

  displayGrid = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = this.grid[i][j];
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

  placeMines = (number) => {
    let cells = this.grid.flat();
    let i = 0;
    while (i < number) {
      const randomCell = cells[Math.floor(Math.random() * cells.length)];
      const selectedCell = this.grid[randomCell.row][randomCell.column];
      if (!selectedCell.mine && selectedCell.covered) {
        selectedCell.mine = true;
        i++;
      }
    }
  };

  showSafeCellsRemaining = () => {
    safeCellsContainer.textContent = this.remainingSafeCells;
  };

  showFlaggedCells = () => {
    flaggedCellsContainer.textContent = this.flaggedCells;
  };

  revealMines = () => {
    const elements = Array.from(gridContainer.children);
    elements.forEach((element) => {
      if (this.grid[element.dataset.row][element.dataset.column].mine) {
        element.textContent = "💣";
      }
      if (window.innerWidth < 420) {
        element.style.fontSize = '12px';
      }
    });
  };

  checkWin = () => {
    if (this.remainingSafeCells === 0) {
      this.showGameEnd("WIN");
    }
  };

  showGameEnd = (condition) => {
    overlay.classList.remove("hidden");
    gameEndModal.classList.remove("hidden");
    gameEndModal.querySelector('button').focus();
    if (condition === "WIN") {
      modalText.textContent = "Congratulations, you win!";
    } else if (condition === "LOSE") {
      modalText.textContent = "Oh no! You lose!";
    }
  };

  showInstructions = () => {
    overlay.classList.remove("hidden");
    instructionsModal.classList.remove("hidden");
    instructionsModal.querySelector('button').focus();
  };

  hideModal = () => {
    overlay.classList.add("hidden");
    gameEndModal.classList.add("hidden");
    instructionsModal.classList.add("hidden");
  };
}

export const game = new Game;
game.init();
game.reset();