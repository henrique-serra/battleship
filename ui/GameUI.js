import BoardRenderer from "./BoardRenderer.js";

export default class GameUI {
  constructor() {
    this.boardRenderer = new BoardRenderer();
    this.selectedShipPlayer1 = null;
    this.selectedShipPlayer2 = null;
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

  selectShip(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipType = shipTypeDiv ? shipTypeDiv.dataset.shipType : null;
    const board = shipTypeDiv.parentElement.previousElementSibling;
    
    if (board.id === 'player-board') {
      this.selectedShipPlayer1 = this.boardRenderer.controller.player1.gameboard.getNextShipToPosition(shipType);
    } else {
      this.selectedShipPlayer2 = this.boardRenderer.controller.player2.gameboard.getNextShipToPosition(shipType);
    }

    shipTypeDiv.classList.add('selected');

    return { 
      selectedShipPlayer1: this.selectedShipPlayer1,
      selectedShipPlayer2: this.selectedShipPlayer2
    }
  }

  clearShipSelection(event) {
    const shipTypeDiv = event.target.closest('.ship-type');
    const shipsRemainingDiv = shipTypeDiv.parentElement;
    const board = shipsRemainingDiv.previousElementSibling;
    const shipTypeDivs = shipsRemainingDiv.querySelectorAll('.ship-type');

    if (board.id === 'player-board') {
      this.selectedShipPlayer1 = null;
    } else {
      this.selectedShipPlayer2 = null;
    }

    [...shipTypeDivs].forEach((div) => {
      if (div.classList.contains('selected')) div.classList.remove('selected');
    });

    return { 
      selectedShipPlayer1: this.selectedShipPlayer1,
      selectedShipPlayer2: this.selectedShipPlayer2
    }
  }
}