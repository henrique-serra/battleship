import Controller from "../Controller.js";
import BoardRenderer from "./BoardRenderer.js";

class GameUI {
  constructor() {
    this.playerBoardEl = document.querySelector('#player-board');
    this.enemyBoardEl = document.querySelector('#enemy-board');
    this.shotsTakenEl = document.querySelector('#shots-taken');
    this.hitsEl = document.querySelector('#hits');
    this.precisionEl = document.querySelector('#precision');
    this.newGameBtn = document.querySelector('#new-game');
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.playerBoardEl, this.enemyBoardEl);
  }
}

export default GameUI;