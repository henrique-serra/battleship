import BoardRenderer from "./BoardRenderer.js";

export default class GameUI {
  constructor() {
    this.boardRenderer = new BoardRenderer();
    this.selectedShip = null;
  }

  placeShip(ship, boardId, row, col, horizontally = true) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;
    
    // Place ship on gameboard
    player.gameboard.placeShip(ship, row, col, horizontally);

    // Place ship on UI board
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

  selectShip(shipTypeDiv) {
    const boardId = shipTypeDiv.parentElement.previousElementSibling.id;
    const gameboard = boardId === 'player-board' ? this.boardRenderer.player1Gameboard : this.boardRenderer.player2Gameboard;

    this.boardRenderer.selectShip(shipTypeDiv);

    const selectedShip = gameboard.getNextShipToPosition(shipTypeDiv.dataset.shipType);

    console.log(selectedShip);

    return selectedShip;
  }
}