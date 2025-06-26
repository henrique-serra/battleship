import Controller from "../Controller.js";
import BoardRenderer from "./BoardRenderer.js";

class GameUI {
  constructor() {
    this.shotsTakenEl = document.querySelector('#shots-taken');
    this.hitsEl = document.querySelector('#hits');
    this.precisionEl = document.querySelector('#precision');
    this.newGameBtn = document.querySelector('#new-game');
    this.gameInfoDiv = document.querySelector('.game-info');
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.playerBoardEl, this.enemyBoardEl);
    this.gameBoardsDiv = this.createElement(this.boardRenderer.createGameBoardsHTML());
    this.gameInfoDiv.after(this.gameBoardsDiv);
    this.playerBoardEl = document.querySelector('#player-board');
    this.enemyBoardEl = document.querySelector('#enemy-board');

    this.setupHandlers();
  }

  createElement(str) {
    const template = document.createElement('template');
    template.innerHTML = str.trim();

    return template.content.firstElementChild;
  }

  resetBoards() {
    const gameBoardsEl = document.querySelector('.game-boards');
    if(gameBoardsEl) gameBoardsEl.remove();

    const newGameBoardsDiv = this.createElement(this.boardRenderer.createGameBoardsHTML());
    this.gameInfoDiv.after(newGameBoardsDiv);
  }

  setupHandlers() {
    this.newGameBtn.addEventListener('click', () => {
      this.resetBoards();
    });

    this.enemyBoardEl.addEventListener('click', (e) => {
      const cell = e.target;
      const dataPosition = cell.getAttribute('data-position');
      const dataRow = cell.getAttribute('data-row');
      const dataCol = cell.getAttribute('data-col');
    })
  }
}

export default GameUI;