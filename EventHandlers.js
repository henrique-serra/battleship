export default class EventHandlers {
  constructor(gameUI) {
    this.gameUI = gameUI;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.setupBoardClickListeners();
    this.setupControlButtonListeners();
    this.setupShipButtonListeners();
  }

  setupBoardClickListeners() {
    const playerBoard = document.getElementById('player-board');
    if (playerBoard) {
      playerBoard.addEventListener('click', (event) => {
        if (event.target.classList.contains('grid-cell') && 
            !event.target.classList.contains('coordinate')) {
          this.handlePlayerBoardClick(event);
        }
      });
    }

    const enemyBoard = document.getElementById('enemy-board');
    if (enemyBoard) {
      enemyBoard.addEventListener('click', (event) => {
        if (event.target.classList.contains('grid-cell') && 
            !event.target.classList.contains('coordinate')) {
          this.handleEnemyBoardClick(event);
        }
      });
    }
  }

  setupControlButtonListeners() {
    const newGameBtn = document.querySelector('#new-game');
    if (newGameBtn) {
      newGameBtn.addEventListener('click', this.handleNewGameClick.bind(this));
    }

    const restartBtn = document.querySelector('#restart-game');
    if (restartBtn) {
      restartBtn.addEventListener('click', this.handleRestartClick.bind(this));
    }

    const clearAllBtns = document.querySelectorAll('.btn-clear-all');
    clearAllBtns.forEach(btn => {
      btn.addEventListener('click', this.handleClearAllClick.bind(this));
    });

    const randomAllBtns = document.querySelectorAll('.btn-random-all');
    randomAllBtns.forEach(btn => {
      btn.addEventListener('click', this.handleRandomAllClick.bind(this));
    });
  }

  setupShipButtonListeners() {
    const shipTypeDivs = document.querySelectorAll('.ship-type');
    shipTypeDivs.forEach((div) => {
      div.addEventListener('click', this.handleShipTypeClick.bind(this));
    })
    
    const randomShipBtns = document.querySelectorAll('.btn-random');
    randomShipBtns.forEach(btn => {
      btn.addEventListener('click', this.handleRandomShipClick.bind(this));
    });
  }

  handlePlayerBoardClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    console.log(`Player board clicked: [${row}, ${col}]`);
    
    this.gameUI.handlePlayerBoardClick(row, col);
  }

  handleEnemyBoardClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    console.log(`Enemy board clicked: [${row}, ${col}]`);
    
    if (this.gameUI && typeof this.gameUI.makeMove === 'function') {
      this.gameUI.makeMove(row, col);
    }
  }

  handleNewGameClick(event) {
    console.log('New game clicked');
    
    if (this.gameUI && typeof this.gameUI.startNewGame === 'function') {
      this.gameUI.startNewGame();
    }
  }

  handleRestartClick(event) {
    console.log('Restart clicked');
    
    if (this.gameUI && typeof this.gameUI.restartGame === 'function') {
      this.gameUI.restartGame();
    }
  }

  handleClearAllClick(event) {
    const board = event.target.dataset.board;
    console.log(`Clear all ships clicked on: ${board} board`);
    
    this.gameUI.clearAllShips(board);
  }

  handleRandomAllClick(event) {
    const board = event.target.dataset.board;
    console.log(`Random all ships clicked on: ${board} board`);
    
    this.gameUI.randomAllShips(board);
  }

  handleRandomShipClick(event) {
    event.stopImmediatePropagation();
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const boardId = shipTypeDiv.parentElement.previousElementSibling.id;
    const player = boardId === 'player-board' ? this.gameUI.boardRenderer.controller.player1 : this.gameUI.boardRenderer.controller.player2;
    const ship = player.gameboard.getNextShipToPosition(shipType);

    this.gameUI.placeShipRandomly(ship, boardId);
  }

  handleShipTypeClick(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const boardId = shipTypeDiv.parentElement.previousElementSibling.id;
    const selectedShip = boardId === 'player-board' ? this.gameUI.selectedShipPlayer1 : this.gameUI.selectedShipPlayer2;

    this.gameUI.clearShipSelection(event);

    if (!selectedShip || selectedShip.shipInfo.name !== shipType) this.gameUI.selectShip(event);
  }

  // Método para remover todos os event listeners (útil para cleanup)
  removeAllEventListeners() {
    // Implementar se necessário para cleanup
    console.log('Removing all event listeners...');
  }

  // Método para reconfigurar listeners (útil quando DOM é recriado)
  refreshEventListeners() {
    this.removeAllEventListeners();
    this.setupEventListeners();
  }
}