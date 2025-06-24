import Player from "./Player";

class Controller {
  constructor(player1 = new Player(), player2 = new Player('Player 2', 'computer')) {
    this.player1 = player1;
    this.player2 = player2;
    this.turn = this.player1;
  }

  
  attack(attacked, row, col) {
    attacked.gameboard.receiveAttack(row, col);
  }
  
  getWinner() {
    if(this.player1.gameboard.allShipsSunk()) return this.player2;
    if(this.player2.gameboard.allShipsSunk()) return this.player1;
    return null;
  }
  
  changeTurn() {
    this.turn = this.turn === this.player1 ? this.player2 : this.player1;
  }

  getCurrentPlayer() {
    return this.turn;
  }

  isPlayerTurn(player) {
    return this.turn === player;
  }

  resetGame() {
    const player1Name = this.player1.name;
    const player1Type = this.player1.type;
    const player2Name = this.player2.name;
    const player2Type = this.player2.type;
    
    this.player1 = new Player(player1Name, player1Type);
    this.player2 = new Player(player2Name, player2Type);
    
    this.turn = this.player1;
  }

  clearGame() {
    this.player1.gameboard.resetGameboard();
    this.player2.gameboard.resetGameboard();
    this.player1.attacks = [];
    this.player2.attacks = [];

    this.turn = this.player1;
  }
}

export default Controller;