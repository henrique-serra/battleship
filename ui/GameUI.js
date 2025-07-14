import BoardRenderer from "./BoardRenderer.js";

export default class GameUI {
  constructor() {
    this.boardRenderer = new BoardRenderer();
    this.selectedShipPlayer1 = null;
    this.selectedShipPlayer2 = null;
  }

  handleShipTypePlayer1Click(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv.dataset.shipType;
    const shipsRemainingDiv = shipTypeDiv.parentElement;
    const shipTypeDivs = shipsRemainingDiv.querySelectorAll('.ship-type');
    const ship = this.gameUI.boardRenderer.controller.player1.gameboard.getNextShipToPosition(shipType);
    
    if (!this.selectedShipPlayer1) {
      this.selectedShipPlayer1 = ship;
      shipTypeDiv.classList.add('selected');
    } else if (this.selectedShipPlayer1 && shipType === this.selectedShipPlayer1.shipInfo.name) {
      this.selectedShipPlayer1 = null;
      shipTypeDiv.classList.remove('selected');
    } else {
      this.selectedShipPlayer1 = ship;
      shipTypeDivs.forEach((div) => {
        if (div.classList.contains('selected')) div.classList.remove('selected');
        if (div === shipTypeDiv) div.classList.add('selected');
      })
    }
  }

  handlePlayer1BoardClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    console.log(this.selectedShipPlayer1);

    if (this.gameUI.boardRenderer.controller.gamePhase === 'positioning' && this.selectedShipPlayer1) {
      const shipType = this.selectedShipPlayer1.shipInfo.name;
      
      this.gameUI.boardRenderer.controller.player1.gameboard.placeShip(this.selectedShipPlayer1, row, col);
      this.gameUI.boardRenderer.placeShip(this.selectedShipPlayer1, 'player-board');

      const nextShipToPosition = this.gameUI.boardRenderer.controller.player1.gameboard.getNextShipToPosition(shipType);
      
      this.selectedShipPlayer1 = nextShipToPosition ? nextShipToPosition : null;
      
      if (!this.selectedShipPlayer1) {
        const shipTypeDiv = document.querySelectorAll(`[data-ship-type="${shipType}"]`)[0];
        shipTypeDiv.classList.remove('selected');
        shipTypeDiv.classList.add('disabled');
      }
    }
  }

  placeShip(ship, boardId, row, col, horizontally = true) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;
    
    // Place ship on gameboard
    player.gameboard.placeShip(ship, row, col, horizontally);

    // Place ship on UI board
    this.boardRenderer.placeShip(ship, boardId);

    console.log(`Ship placed at ${row}, ${col}`);
  }

  placeShipRandomly(ship, boardId) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;

    const { row, col } = player.gameboard.placeShipRandomly(ship);

    this.boardRenderer.placeShip(ship, boardId);

    console.log(`Ship placed at ${row}, ${col}`);
  }

  removeShip(ship, boardId) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;

    // Remove ship from UI board
    this.boardRenderer.removeShip(ship, boardId);

    // Remove ship from gameboard
    player.gameboard.removeShip(ship);

    console.log(`Ship removed from ${boardId}`);
  }

  replaceShipPosition(ship, boardId, row, col, horizontally = true) {
    this.removeShip(ship, boardId);
    this.placeShip(ship, boardId, row, col, horizontally);
  }

  attack(boardId, row, col) {
    const attacker = boardId === 'player-board' ? this.boardRenderer.controller.player2 : this.boardRenderer.controller.player1;
    const attacked = attacker === this.boardRenderer.controller.player1 ? this.boardRenderer.controller.player2 : this.boardRenderer.controller.player1;

    // Check if position already attacked
    if (attacker.attacks.some(([r, c]) => r === row && c === col)) throw new Error('Position already attacked');

    const result = this.boardRenderer.controller.attack(attacked, row, col);
    console.log(`${attacker.name} attacks at ${row}, ${col}`);

    if (result.hit) {
      this.boardRenderer.showHit(boardId, row, col);
    } else this.boardRenderer.showMiss(boardId, row, col);
  }
}