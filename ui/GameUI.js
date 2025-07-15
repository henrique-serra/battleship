import BoardRenderer from "./BoardRenderer.js";

export default class GameUI {
  constructor() {
    this.boardRenderer = new BoardRenderer();
    this.selectedShipPlayer1 = null;
    this.selectedShipPlayer2 = null;
  }

  setSelectedShipPlayer1(ship) {
    this.selectedShipPlayer1 = ship;
  }

  placeShip(ship, boardId, row, col, horizontally = true) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;
    
    // Place ship on gameboard
    player.gameboard.placeShip(ship, row, col, horizontally);

    // Place ship on UI board
    this.boardRenderer.placeShip(ship, boardId);

    // Update ship count
    this.boardRenderer.updateShipCount(boardId, ship.shipInfo.name);

    // Disable ship type div if there's no more ships to position
    const nextShipToPosition = player.gameboard.getNextShipToPosition(ship.shipInfo.name);
    this.selectedShipPlayer1 = nextShipToPosition ? nextShipToPosition : null;
    if (!this.selectedShipPlayer1) {
      this.boardRenderer.disableShipTypeDiv(ship.shipInfo.name, boardId);
    }

    console.log(`Ship placed at ${row}, ${col}`);
  }

  placeShipRandomly(ship, boardId) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;

    // Place ship randomly on gameboard
    const { row, col } = player.gameboard.placeShipRandomly(ship);

    // Place ship on UI board
    this.boardRenderer.placeShip(ship, boardId);

    // Update ship count
    this.boardRenderer.updateShipCount(boardId, ship.shipInfo.name);

    // Disable ship type div if there's no more ships to position
    const qtyShipsNotPositioned = player.gameboard.getQtyShipsNotPositioned(ship.shipInfo.name);
    if (qtyShipsNotPositioned == 0) {
      this.boardRenderer.disableShipTypeDiv(ship.shipInfo.name, boardId);
    }

    console.log(`Ship placed at ${row}, ${col}`);
  }

  placeAllShipsRandomly(event) {
    const dataBoard = event.target.dataset.board;
    const player = dataBoard === 'player' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;
    const boardId = dataBoard === 'player' ? 'player-board' : 'enemy-board';

    player.gameboard.ships.forEach((ship) => {
      if (ship.positions.length === 0) this.placeShipRandomly(ship, boardId);
    })
  }

  clearAllShips(event) {
    const dataBoard = event.target.dataset.board;
    const player = dataBoard === 'player' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;
    const boardId = dataBoard === 'player' ? 'player-board' : 'enemy-board';

    player.gameboard.ships.forEach((ship) => {
      if (ship.positions.length !== 0) this.removeShip(ship, boardId);
    })
  }

  allShipsPositioned() {
    return this.boardRenderer.player1Gameboard.allShipsPositioned() && this.boardRenderer.player2Gameboard.allShipsPositioned()
  }

  removeShip(ship, boardId) {
    const player = boardId === 'player-board' ? this.boardRenderer.controller.player1 : this.boardRenderer.controller.player2;

    // Remove ship from UI board
    this.boardRenderer.removeShip(ship, boardId);

    // Remove ship from gameboard
    player.gameboard.removeShip(ship);

    // Update ship count
    this.boardRenderer.updateShipCount(boardId, ship.shipInfo.name);

    // Enable ship type div if disabled
    const shipTypeDiv = this.boardRenderer.getShipTypeDiv(ship.shipInfo.name, boardId);
    if (shipTypeDiv.classList.contains('disabled')) {
      this.boardRenderer.enableShipTypeDiv(ship.shipInfo.name, boardId);
    }

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