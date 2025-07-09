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

  makeMove(row, col) {
    // Verifica se o jogo está na fase correta
    if (this.gamePhase !== 'attacks') {
      throw new Error("Can't make moves during positioning phase");
    }

    // Determina quem está atacando e quem está sendo atacado
    const attacker = this.turn;
    const attacked = this.turn === this.player1 ? this.player2 : this.player1;

    // Verifica se a posição já foi atacada
    const alreadyAttacked = attacker.attacks.some(([r, c]) => r === row && c === col);
    if (alreadyAttacked) {
      throw new Error(`Position [${row}, ${col}] already attacked`);
    }

    // Realiza o ataque
    const attackResult = attacked.gameboard.receiveAttack(row, col);
    attacker.attacks.push([row, col]);

    // Constrói o resultado para o GameUI
    const result = {
      hit: attackResult.hit,
      miss: !attackResult.hit,
      attacker: attacker.name,
      attacked: attacked.name,
      position: [row, col]
    };

    // Se acertou, verifica se afundou
    if (attackResult.hit && attackResult.ship) {
      const ship = attackResult.ship;
      
      result.sunk = ship.isSunk();
      
      if (result.sunk) {
        result.shipType = ship.shipInfo.name;
        result.sunkPositions = ship.positions;
      }
    }

    // Verifica se o jogo acabou
    result.gameOver = attacked.gameboard.allShipsSunk();
    if (result.gameOver) {
      result.winner = attacker;
      this.setPhase('end');
    }

    // Muda o turno se não for game over
    if (!result.gameOver) {
      this.changeTurn();
    }

    return result;
  }

  // Método adicional para obter estatísticas do jogador
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

  // Método para iniciar novo jogo (usado pelo GameUI)
  startNewGame() {
    this.resetGame();
    
    // Posiciona navios aleatoriamente para ambos os jogadores
    this.player1.gameboard.ships.forEach((ship) => this.player1.gameboard.placeShipRandomly(ship));
    this.player2.gameboard.ships.forEach((ship) => this.player2.gameboard.placeShipRandomly(ship));
    
    // Muda para fase de ataques
    this.setPhase('attacks');
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
    
    attacked.gameboard.receiveAttack(row, col);
    attacker.attacks.push([row, col]);
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

  clearGame() {
    this.player1.gameboard.resetGameboard();
    this.player2.gameboard.resetGameboard();
    this.player1.attacks = [];
    this.player2.attacks = [];

    this.turn = this.player1;
    this.setPhase('positioning');
  }
}

export default Controller;