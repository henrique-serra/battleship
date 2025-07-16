import Player from "./Player.js";

class Controller {
  constructor(player1 = new Player(), player2 = new Player('Player 2', 'computer')) {
    this.player1 = player1;
    this.player2 = player2;
    this.turn = this.player1;
    this.gamePhase = 'positioning';
    this.phases = ['positioning', 'attacks', 'end'];
    this.currentPhaseIndex = 0;
  }

  getPlayer1Stats() {
    const attacks = this.player1.attacks;
    const hits = attacks.filter(([row, col]) => {
      return this.player2.gameboard.defenseBoard[row][col] && 
            this.player2.gameboard.defenseBoard[row][col].hitTaken;
    });

    return {
      shots: attacks.length,
      hits: hits.length,
      misses: attacks.length - hits.length
    };
  }

  setPhase(phaseName) {
    if (this.phases.includes(phaseName)) {
      this.gamePhase = phaseName;
      this.currentPhaseIndex = this.phases.indexOf(phaseName);
    }
  }

  nextPhase() {
    if (this.currentPhaseIndex < this.phases.length - 1) {
      this.currentPhaseIndex++;
      this.gamePhase = this.phases[this.currentPhaseIndex];
    }
  }

  attack(attacked, row, col) {
    if(this.gamePhase !== 'attacks') throw new Error("Can't attack during positioning phase");
    
    const attacker = attacked === this.player1 ? this.player2 : this.player1;
    
    const result = attacked.gameboard.receiveAttack(row, col);
    attacker.attacks.push([row, col, result.hit, result.ship]);

    return result;
  }

  player2Attack() {
    const attacker = this.player2;
    const attacked = this.player1;

    if (attacker.attacks.length === 0) {
      const randomRow = Math.floor(Math.random() * 10);
      const randomCol = Math.floor(Math.random() * 10);
      console.log(randomRow);
      console.log(randomCol);
    }
    const [lastAttackRow, lastAttackCol, lastAttackHit, lastAttackShip] = attacker.attacks.at(-1);
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
    this.setPhase('positioning');
  }
}

export default Controller;