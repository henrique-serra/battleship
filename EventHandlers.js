export default class EventHandlers {
  constructor(gameUI) {
    this.gameUI = gameUI;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.setupBoardClickListeners();
    this.setupControlButtonListeners();
    this.setupShipsRemainingListenersPlayer1();
    this.setupShipsRemainingListenersPlayer2();
    this.handleToggleOrientationClick();
  }

  setupBoardClickListeners() {
    const playerBoard = document.querySelector('#player-board');
    playerBoard.addEventListener('click', this.handlePlayer1BoardClick.bind(this));

    const enemyBoard = document.getElementById('enemy-board');
    if (enemyBoard) {
      enemyBoard.addEventListener('click', (event) => {
        if (event.target.classList.contains('grid-cell') && 
            !event.target.classList.contains('coordinate')) {
          this.handlePlayer2BoardClick(event);
        }
      });
    }
  }

  setupShipsRemainingListenersPlayer1() {
    const shipsRemainingDivPlayer1 = document.querySelectorAll('.ships-remaining')[0];
    
    const clearAllBtn = shipsRemainingDivPlayer1.querySelector('.btn-clear-all');
    clearAllBtn.addEventListener('click', this.handleClearAllClick.bind(this));

    const randomAllBtn = shipsRemainingDivPlayer1.querySelector('.btn-random-all');
    randomAllBtn.addEventListener('click', this.handleRandomAllClick.bind(this));

    const shipTypeDivsPlayer1 = shipsRemainingDivPlayer1.querySelectorAll('.ship-type');
    shipTypeDivsPlayer1.forEach((div) => {
      div.addEventListener('click', this.handleShipTypePlayer1Click.bind(this));
    });
    
    const randomShipBtns = shipsRemainingDivPlayer1.querySelectorAll('.btn-random');
    randomShipBtns.forEach(btn => {
      btn.addEventListener('click', this.handleRandomShipClick.bind(this));
    });
  }

  setupShipsRemainingListenersPlayer2() {
    const shipsRemainingDivPlayer2 = document.querySelectorAll('.ships-remaining')[1];
    
    const clearAllBtn = shipsRemainingDivPlayer2.querySelector('.btn-clear-all');
    clearAllBtn.addEventListener('click', this.handleClearAllClick.bind(this));

    const randomAllBtn = shipsRemainingDivPlayer2.querySelector('.btn-random-all');
    randomAllBtn.addEventListener('click', this.handleRandomAllClick.bind(this));

    const shipTypeDivsPlayer2 = shipsRemainingDivPlayer2.querySelectorAll('.ship-type');
    shipTypeDivsPlayer2.forEach((div) => {
      div.addEventListener('click', this.handleShipTypePlayer2Click.bind(this));
    });
    
    const randomShipBtns = shipsRemainingDivPlayer2.querySelectorAll('.btn-random');
    randomShipBtns.forEach(btn => {
      btn.addEventListener('click', this.handleRandomShipClick.bind(this));
    });
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
  }

  handleShipTypePlayer1Click(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const shipsRemainingDiv = shipTypeDiv.parentElement;
    const shipTypeDivs = shipsRemainingDiv.querySelectorAll('.ship-type');
    const ship = this.gameUI.boardRenderer.controller.player1.gameboard.getNextShipToPosition(shipType);
    
    // IF there's no ship selected, select the one clicked
    if (!this.gameUI.selectedShipPlayer1) {
      this.gameUI.selectedShipPlayer1 = ship;
      shipTypeDiv.classList.add('selected');
      // IF there's a selected ship already AND Ship Type Div clicked is of same type as the already selected ship, clear selection
    } else if (this.gameUI.selectedShipPlayer1 && shipType === this.gameUI.selectedShipPlayer1.shipInfo.name) {
      this.gameUI.selectedShipPlayer1 = null;
      shipTypeDiv.classList.remove('selected');
    } else {
      this.gameUI.selectedShipPlayer1 = ship;
      shipTypeDivs.forEach((div) => {
        if (div.classList.contains('selected')) div.classList.remove('selected');
        if (div === shipTypeDiv) div.classList.add('selected');
      })
    }
  }

  handleShipTypePlayer2Click(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const shipsRemainingDiv = shipTypeDiv.parentElement;
    const shipTypeDivs = shipsRemainingDiv.querySelectorAll('.ship-type');
    const ship = this.gameUI.boardRenderer.controller.player2.gameboard.getNextShipToPosition(shipType);
    
    // IF there's no ship selected, select the one clicked
    if (!this.gameUI.selectedShipPlayer2) {
      this.gameUI.selectedShipPlayer2 = ship;
      shipTypeDiv.classList.add('selected');
      // IF there's a selected ship already AND Ship Type Div clicked is of same type as the already selected ship, clear selection
    } else if (this.gameUI.selectedShipPlayer2 && shipType === this.gameUI.selectedShipPlayer2.shipInfo.name) {
      this.gameUI.selectedShipPlayer2 = null;
      shipTypeDiv.classList.remove('selected');
    } else {
      this.gameUI.selectedShipPlayer2 = ship;
      shipTypeDivs.forEach((div) => {
        if (div.classList.contains('selected')) div.classList.remove('selected');
        if (div === shipTypeDiv) div.classList.add('selected');
      })
    }
  }

  handlePlayer1BoardClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const player1 = this.gameUI.boardRenderer.controller.player1;

    // POSITIONING PHASE
    if (this.gameUI.boardRenderer.controller.gamePhase === 'positioning') {
      const ship = player1.gameboard.defenseBoard[row][col].ship;

      // If player clicks on a ship already positioned, remove it
      if (ship) {
        this.gameUI.removeShip(ship, 'player-board');
        // ELSE, IF has ship selected, position it
      } else if (this.gameUI.selectedShipPlayer1) {
        this.gameUI.placeShip(this.gameUI.selectedShipPlayer1, 'player-board', row, col, this.gameUI.boardRenderer.horizontally);
        console.log(this.gameUI.allShipsPositioned());
      }

      if (this.gameUI.allShipsPositioned()) this.gameUI.boardRenderer.showAttackPhaseModal();
    }
  }

  handlePlayer2BoardClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const player1 = this.gameUI.boardRenderer.controller.player1;
    const player2 = this.gameUI.boardRenderer.controller.player2;

    // POSITIONING PHASE
    if (this.gameUI.boardRenderer.controller.gamePhase === 'positioning') {
      const ship = player2.gameboard.defenseBoard[row][col].ship;

      // If player clicks on a ship already positioned, remove it
      if (ship) {
        this.gameUI.removeShipPlayer2(ship);
        // ELSE, IF has ship selected, position it
      } else if (this.gameUI.selectedShipPlayer2) {
        this.gameUI.placeShipPlayer2(this.gameUI.selectedShipPlayer2, row, col);
        console.log(this.gameUI.allShipsPositioned());
      }

      if (this.gameUI.allShipsPositioned()) this.gameUI.boardRenderer.showAttackPhaseModal();
      // IF it's attacks phase and player1 turn, player1 attacks
    } else if (this.gameUI.boardRenderer.controller.gamePhase === 'attacks' && this.gameUI.boardRenderer.controller.turn === this.gameUI.boardRenderer.controller.player1) {
      this.gameUI.attack('enemy-board', row, col);
      this.gameUI.boardRenderer.updateShotsCount();
      this.gameUI.boardRenderer.updateHitsCount();
      this.gameUI.boardRenderer.updatePrecisionPercentage();
      this.gameUI.checkWin();
      this.gameUI.boardRenderer.controller.changeTurn();
      this.gameUI.player2Attack();
      this.gameUI.checkWin();
      this.gameUI.boardRenderer.controller.changeTurn();
    }
  }

  handleNewGameClick(event) {
    this.gameUI.startNewGame();
  }

  handleRestartClick(event) {
    console.log('Restart clicked');
    
    if (this.gameUI && typeof this.gameUI.restartGame === 'function') {
      this.gameUI.restartGame();
    }
  }

  handleClearAllClick(event) {   
    this.gameUI.clearAllShips(event);
  }

  handleRandomAllClick(event) {
    this.gameUI.placeAllShipsRandomly(event);

    if (this.gameUI.allShipsPositioned()) this.gameUI.boardRenderer.showAttackPhaseModal();
  }

  handleRandomShipClick(event) {
    event.stopImmediatePropagation();
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const boardId = shipTypeDiv.parentElement.previousElementSibling.id;
    const player = boardId === 'player-board' ? this.gameUI.boardRenderer.controller.player1 : this.gameUI.boardRenderer.controller.player2;
    const ship = player.gameboard.getNextShipToPosition(shipType);

    if (boardId === 'player-board') {
      this.gameUI.placeShipRandomly(ship, boardId);
    } else {
      this.gameUI.placeShipPlayer2(ship, undefined, undefined, undefined, true);
      console.log(ship.positions);
    }

    if (this.gameUI.allShipsPositioned()) this.gameUI.boardRenderer.showAttackPhaseModal();
  }

  handleToggleOrientationClick() {
    const toggle = document.querySelector('#orientationToggle');

    toggle.addEventListener('click', () => {
      this.gameUI.boardRenderer.horizontally = !this.gameUI.boardRenderer.horizontally;
      this.gameUI.boardRenderer.updateOrientation();
    })
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