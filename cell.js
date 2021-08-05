// import { game } from "./index.js";
import { game } from './game.js';

class Cell {
  constructor(row, column) {
    this.row = row;
    this.column = column;
    this.covered = true;
    this.flagged = false;
    this.mine = false;
  }

  isMine() {
    game.revealMines();
    game.showGameEnd("LOSE");
  }

  uncover() {
    this.covered = false;
    game.remainingSafeCells -= 1;
    game.showSafeCellsRemaining();
  }

  getGridElement() {
    return document.querySelector(
      `[data-row='${this.row}'][data-column='${this.column}']`
    );
  }

  getNeighbours() {
    let neighbours = [];
    for (let i = this.row - 1; i <= this.row + 1; i++) {
      for (let j = this.column - 1; j <= this.column + 1; j++) {
        if (i >= 0 && i < 10 && j >= 0 && j < 10) {
          neighbours.push(game.grid[i][j]);
        }
      }
    }
    return neighbours;
  }

  getNeighbouringMineCount(cells) {
    this.neighbouringMines = cells.filter((cell) => cell.mine).length;
  }

  showNeighbouringMineCount(element = this.getGridElement()) {
    element.textContent = this.neighbouringMines || "";
  }

  replaceButton() {
    const element = this.getGridElement();
    if (element.nodeName === "BUTTON") {
      const div = document.createElement("div");
      div.classList.add("grid-cell");
      div.dataset.row = element.dataset.row;
      div.dataset.column = element.dataset.column;
      element.replaceWith(div);
    }
  }

  handleClick(event) {
    // The first button the user clicks will never be a bomb
    if (!game.firstButtonClicked) {
      if (this.mine) {
        this.mine = false;
        game.placeMines(1);
      }
      game.firstButtonClicked = true;
    }

    if (this.mine) {
      this.isMine();
    } else {
      if (this.covered) {
        this.uncover();
        if (this.flagged) {
          this.handleFlag(event);
        }
        this.replaceButton();
        this.getNeighbouringMineCount(this.getNeighbours());
        this.showNeighbouringMineCount();
        // If cell has no neighbouring mines, uncover all neighbouring cells
        // and repeat loop for each
        if (this.neighbouringMines === 0) {
          this.getNeighbours().forEach((neighbour) => neighbour.handleClick());
        }
      }
    }
    game.checkWin();
  }

  handleFlag(event) {
    event.preventDefault();
    const element = this.getGridElement();

    if (this.flagged === false) {
      this.flagged = true;
      game.flaggedCells += 1;
      element.textContent = "🚩";
      if (window.innerWidth < 420) {
        element.style.fontSize = '12px';
      }
      game.showFlaggedCells();
    } else {
      this.flagged = false;
      game.flaggedCells -= 1;
      element.textContent = "";
      game.showFlaggedCells();
    }
  }
}

export default Cell;
