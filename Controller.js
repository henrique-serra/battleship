import Player from "./Player";

class Controller {
  constructor(player1 = new Player(), player2 = new Player('Player 2', 'computer')) {
    this.player1 = player1;
    this.player2 = player2;
  }

  attack(attacked, row, col) {
    attacked.gameboard.receiveAttack(row, col);
  }
}

export default Controller;