import Controller from "../Controller.js";
import BoardRenderer from "./BoardRenderer.js";

class GameUI {
  constructor() {
    this.playerBoardEl = document.querySelector('#player-board');
    this.enemyBoardEl = document.querySelector('#enemy-board');
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.playerBoardEl, this.enemyBoardEl);
  }
}

export default GameUI;