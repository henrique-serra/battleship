import Controller from "../Controller";
import BoardRenderer from "./BoardRenderer";

class GameUI {
  constructor() {
    this.playerBoardEl = document.querySelector('#player-board');
    this.enemyBoardEl = document.querySelector('#enemy-board');
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.playerBoardEl, this.enemyBoardEl);

    this.setupEventListeners();
    this.renderInitialState();
  }

  setupEventListeners() {
    this.enemyBoardEl.addEventListener('click', (e) => {
      if(e.target.classList.contains('grid-cell') && !e.target.classList.contains('coordinate')) {
        const coords = this.getCellCoordinates(e.target);
        this.handleAttack(coords.row, coords.col);
      }
    })
  };

  handleAttack(row, col) {
    try {
      this.controller.attack(this.controller.player2, row, col);
      this.updateVisualAfterAttack(row, col);

      const winner = this.controller.getWinner();
      if (winner) {
        this.handleGameEnd(winner);
      } else {
        this.controller.changeTurn();
        this.updateTurnDisplay();
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  updateVisualAfterAttack(row, col) {
    const cell = this.controller.player2.gameboard.defenseBoard[row][col];

    if(cell.ship) {
      this.boardRenderer.insertClass(this.enemyBoardEl, 'hit', row, col);
      if(cell.ship.isSunk()) {
        this.markShipAsSunk(cell.ship);
      }
    } else {
      this.boardRenderer.insertClass(this.enemyBoardEl, 'miss', row, col);
    }
  };

  markShipAsSunk(sunkShip) {
    const defenseBoard = this.controller.player2.gameboard.defenseBoard;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (defenseBoard[row][col].ship === sunkShip) {
          this.boardRenderer.insertClass(this.enemyBoardEl, 'sunk', row, col);
        }
      }
    }
  };

  renderPlayerShips() {
    const defenseBoard = this.controller.player1.gameboard.defenseBoard;

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (defenseBoard[row][col].ship) {
          this.renderer.insertClass(this.playerBoardEl, 'ship', row, col);
        }
      }
    }
  };

  getCellCoordinates(cellElement) {
    const allCels = [...cellElement.parentElement.children];
    const index = allCels.indexOf(cellElement);
    const adjustedIndex = index - 11;
    const row = Math.floor(adjustedIndex / 11);
    const col = adjustedIndex % 11;

    return { row, col };
  }

  updateTurnDisplay() {
    const currentPlayer = this.controller.getCurrentPlayer();
    // Atualizar interface para mostrar de quem é o turno
    console.log(`Turno de: ${currentPlayer.name}`);
  }

  handleGameEnd(winner) {
    alert(`Jogo acabou! Vencedor: ${winner.name}`);
  }

  renderInitialState() {
    // Coloca alguns navios de exemplo para teste
    this.controller.player1.gameboard.placeShip(3, 0, 0, true);
    this.controller.player1.gameboard.placeShip(2, 2, 2, false);
    
    this.controller.player2.gameboard.placeShip(4, 1, 1, true);
    this.controller.player2.gameboard.placeShip(1, 5, 5, true);
    
    // Renderiza navios do jogador
    this.renderPlayerShips();
  }
}

export default GameUI;