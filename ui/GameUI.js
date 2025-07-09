export default class GameUI {
  constructor(controller, boardRenderer) {
    this.controller = controller;
    this.boardRenderer = boardRenderer;
    this.gameState = 'setup'; // 'setup', 'playing', 'gameOver'
    this.currentPlayer = 1; // 1 ou 2
    
    this.initializeGame();
  }

  initializeGame() {
    console.log('Initializing game...');
    
    // Renderiza os boards iniciais
    this.renderBoards();
    
    // Mostra navios do jogador 1 no seu board
    this.showPlayerShips();
    
    // Atualiza UI inicial
    this.updateGameStats();
    
    console.log('Game initialized');
  }

  renderBoards() {
    // Cria os boards no DOM se ainda não existem
    const gameContainer = document.querySelector('.game-container') || document.body;
    const controlsDiv = gameContainer.querySelector('.controls');
    
    // Remove boards existentes
    const existingBoards = gameContainer.querySelector('.game-boards');
    if (existingBoards) {
      existingBoards.remove();
    }
    
    // Cria novos boards
    const gameBoardsDiv = this.boardRenderer.createDivGameBoards();
    gameContainer.insertBefore(gameBoardsDiv, controlsDiv);
  }

  showPlayerShips() {
    // Mostra todos os navios do jogador 1 no seu board
    const player1Gameboard = this.controller.player1.gameboard;
    player1Gameboard.ships.forEach(ship => {
      ship.positions.forEach(([row, col]) => {
        this.boardRenderer.showShip('player-board', row, col);
      });
    });
  }

  // Métodos chamados pelo EventHandlers - Atacar
  makeMove(row, col) {
    if (this.gameState === 'end') {
      console.log('Game over! Restart or create New Game');
      return;
    }

    console.log(`Making move: [${row}, ${col}]`);

    try {
      // Processa o ataque via Controller
      const result = this.controller.makeMove(row, col);
      
      // Atualiza visual baseado no resultado
      if (result.hit) {
        this.boardRenderer.showHit('enemy-board', row, col);
        console.log('Hit!');
        
        if (result.sunk) {
          console.log(`Ship sunk: ${result.shipType}`);
          this.markShipAsSunk(result.sunkPositions);
        }
        
        if (result.gameOver) {
          console.log('Game Over! Player wins!');
          this.handleGameOver('player');
          return;
        }
      } else {
        this.boardRenderer.showMiss('enemy-board', row, col);
        console.log('Miss!');
      }

      // Atualiza estatísticas
      this.updateGameStats();
      
      // Troca de jogador se necessário
      this.switchPlayer();
      
    } catch (error) {
      console.error('Error making move:', error);
    }
  }

  markShipAsSunk(positions) {
    positions.forEach(([row, col]) => {
      this.boardRenderer.showSunk('enemy-board', row, col);
    });
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.updateTurnIndicator();
  }

  // Métodos chamados pelo EventHandlers - Posicionar navios
  handlePlayerBoardClick(row, col) {
    if (this.gameState !== 'setup') {
      console.log('Not in setup phase');
      return;
    }

    console.log(`Player board clicked: [${row}, ${col}]`);
    
    // Aqui você implementaria a lógica de posicionamento manual
    // Por enquanto, só log
    console.log('Ship placement logic would go here');
  }

  // Métodos de controle do jogo
  startNewGame() {
    console.log('Starting new game...');
    
    // Reinicia o controller
    this.controller.startNewGame();
    
    // Reinicia estado
    this.gameState = 'setup';
    this.currentPlayer = 1;
    
    // Re-renderiza tudo
    this.initializeGame();
  }

  restartGame() {
    console.log('Restarting game...');
    this.startNewGame();
  }

  // Métodos de controle de navios
  clearPlayerShips() {
    console.log('Clearing player ships...');
    
    try {
      // Limpa navios no controller
      this.controller.player1.gameboard.clearAllShips();
      
      // Atualiza visual - remove todas as classes de ship
      const playerBoard = document.getElementById('player-board');
      const cells = playerBoard.querySelectorAll('.grid-cell:not(.coordinate)');
      cells.forEach(cell => {
        cell.classList.remove('ship', 'hit', 'miss', 'sunk');
      });
      
      this.updateGameStats();
      
    } catch (error) {
      console.error('Error clearing player ships:', error);
    }
  }

  clearEnemyShips() {
    console.log('Clearing enemy ships...');
    
    try {
      // Limpa navios no controller
      this.controller.player2.gameboard.clearAllShips();
      
      // Atualiza visual
      const enemyBoard = document.getElementById('enemy-board');
      const cells = enemyBoard.querySelectorAll('.grid-cell:not(.coordinate)');
      cells.forEach(cell => {
        cell.classList.remove('ship', 'hit', 'miss', 'sunk');
      });
      
      this.updateGameStats();
      
    } catch (error) {
      console.error('Error clearing enemy ships:', error);
    }
  }

  randomizePlayerShips() {
    console.log('Randomizing player ships...');
    
    try {
      // Limpa e posiciona aleatoriamente
      this.controller.player1.gameboard.clearAllShips();
      this.controller.player1.gameboard.placeShipsRandomly();
      
      // Atualiza visual
      this.clearPlayerShips();
      this.showPlayerShips();
      
      this.updateGameStats();
      
    } catch (error) {
      console.error('Error randomizing player ships:', error);
    }
  }

  randomizeEnemyShips() {
    console.log('Randomizing enemy ships...');
    
    try {
      this.controller.player2.gameboard.clearAllShips();
      this.controller.player2.gameboard.placeShipsRandomly();
      
      this.updateGameStats();
      
    } catch (error) {
      console.error('Error randomizing enemy ships:', error);
    }
  }

  randomizeShip(shipType) {
    console.log(`Randomizing ${shipType} ship...`);
    
    try {
      // Remove navios do tipo especificado
      const gameboard = this.controller.player1.gameboard;
      gameboard.removeShipsByType(shipType);
      
      // Posiciona aleatoriamente apenas esse tipo
      gameboard.placeShipTypeRandomly(shipType);
      
      // Atualiza visual
      this.clearPlayerShips();
      this.showPlayerShips();
      
      this.updateGameStats();
      
    } catch (error) {
      console.error(`Error randomizing ${shipType}:`, error);
    }
  }

  // Métodos de atualização da UI
  updateGameStats() {
    this.updateShotStats();
    this.updateShipCounts();
    this.updateTurnIndicator();
  }

  updateShotStats() {
    // Atualiza estatísticas de tiros (Your shots, Hits, Precision)
    const player1Stats = this.controller.getPlayer1Stats();
    
    const shotsElement = document.querySelector('.your-shots .stat-value');
    const hitsElement = document.querySelector('.hits .stat-value');
    const precisionElement = document.querySelector('.precision .stat-value');
    
    if (shotsElement) shotsElement.textContent = player1Stats.shots || 0;
    if (hitsElement) hitsElement.textContent = player1Stats.hits || 0;
    if (precisionElement) {
      const precision = player1Stats.shots > 0 ? 
        Math.round((player1Stats.hits / player1Stats.shots) * 100) : 0;
      precisionElement.textContent = `${precision}%`;
    }
  }

  updateShipCounts() {
    // Atualiza contadores de navios restantes
    const player1Ships = this.controller.player1.gameboard.getRemainingShipsByType();
    const player2Ships = this.controller.player2.gameboard.getRemainingShipsByType();
    
    // Atualiza player board
    Object.entries(player1Ships).forEach(([shipType, count]) => {
      const playerShipElement = document.querySelector(`[data-board="player"] [data-ship-type="${shipType}"] .ship-count`);
      if (playerShipElement) playerShipElement.textContent = count;
    });
    
    // Atualiza enemy board
    Object.entries(player2Ships).forEach(([shipType, count]) => {
      const enemyShipElement = document.querySelector(`[data-board="enemy"] [data-ship-type="${shipType}"] .ship-count`);
      if (enemyShipElement) enemyShipElement.textContent = count;
    });
  }

  updateTurnIndicator() {
    const turnElement = document.querySelector('.turn-indicator');
    if (turnElement) {
      turnElement.textContent = this.currentPlayer === 1 ? "Your turn!" : "Enemy's turn!";
    }
  }

  // Método de fim de jogo
  handleGameOver(winner) {
    this.gameState = 'end';
    console.log(`Game Over! Winner: ${winner}`);
    
    // Aqui você poderia mostrar modal de vitória, desabilitar cliques, etc.
    const turnElement = document.querySelector('.turn-indicator');
    if (turnElement) {
      turnElement.textContent = winner === 'player' ? "You won! 🎉" : "You lost! 😔";
    }
  }

  // Método para mudar estado do jogo
  setGameState(newState) {
    console.log(`Game state changed: ${this.gameState} -> ${newState}`);
    this.gameState = newState;
    this.updateTurnIndicator();
  }
}