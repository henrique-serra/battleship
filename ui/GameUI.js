import Controller from "../Controller.js";
import BoardRenderer from "./BoardRenderer.js";

class GameUI {
  constructor() {
    this.shotsTakenEl = document.querySelector('#shots-taken');
    this.hitsEl = document.querySelector('#hits');
    this.precisionEl = document.querySelector('#precision');
    this.newGameBtn = document.querySelector('#new-game');
    this.gameInfoDiv = document.querySelector('.game-info');
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.player1BoardEl, this.player2BoardEl);
    this.gameBoardsDiv = this.createElement(this.boardRenderer.createGameBoardsHTML());
    // Add to DOM
    this.gameInfoDiv.after(this.gameBoardsDiv);
    this.player1BoardEl = document.querySelector('#player-board');
    this.player2BoardEl = document.querySelector('#enemy-board');
    this.boardSections = document.querySelectorAll('.board-section');
    
    // Positioning ships
    this.selectedShip = null;
    this.isPlacingShip = false;
    this.shipOrientation = 'horizontal';
    
    this.player1Ships = this.controller.player1.gameboard.ships;
    this.player2Ships = this.controller.player2.gameboard.ships;
    
    this.player1ShipsRemainingDiv = this.boardSections[0].querySelector('.ships-remaining');
    this.player2ShipsRemainingDiv = this.boardSections[1].querySelector('.ships-remaining');
    this.player1ShipTypeDivs = this.player1ShipsRemainingDiv.querySelectorAll('.ship-type');
    this.player2ShipTypeDivs = this.player2ShipsRemainingDiv.querySelectorAll('.ship-type');

    this.setupHandlers();
  }

  getShip(shipTypeDiv, player) {
    const shipType = shipTypeDiv.dataset.shipType;

    return player.gameboard.ships.filter((ship) => ship.type === shipType)[0];
  }

  placeShipOnBoard(ship, playerNumber) {
    ship.positions.forEach(([row, col]) => {
      const cell = this[`player${playerNumber}BoardEl`].querySelector(`[data-row="${row}"][data-col="${col}"]`);

      cell.classList.add('ship');
    })
  }

  createElement(str) {
    const template = document.createElement('template');
    template.innerHTML = str.trim();

    return template.content.firstElementChild;
  }

  resetBoards() {
    const gameBoardsEl = document.querySelector('.game-boards');
    if(gameBoardsEl) gameBoardsEl.remove();

    const newGameBoardsDiv = this.createElement(this.boardRenderer.createGameBoardsHTML());
    this.gameInfoDiv.after(newGameBoardsDiv);
  }

  setupHandlers() {
    this.newGameBtn.addEventListener('click', () => {
      this.resetBoards();
    });

    this.player1BoardEl.addEventListener('click', (e) => {
      const gameCell = e.target.closest('[data-position]');
      const row = Number(gameCell.dataset.row);
      const col = Number(gameCell.dataset.col);

      if(
        this.controller.gamePhase === 'positioning' &&
        this.selectedShip
        // this.selectedShip.positions.length !== 0
      ) {
        this.controller.player1.gameboard.placeShip(this.selectedShip, row, col);
        this.placeShipOnBoard(this.selectedShip, '1');
      }
    })

    this.player2BoardEl.addEventListener('click', (e) => {
      const cell = e.target;
      const dataPosition = cell.getAttribute('data-position');
      const dataRow = cell.getAttribute('data-row');
      const dataCol = cell.getAttribute('data-col');
    });

    const shipsRemainingDivs = [this.player1ShipsRemainingDiv, this.player2ShipsRemainingDiv];
    shipsRemainingDivs.forEach((shipRemainingDiv, index) => {
      shipRemainingDiv.addEventListener('click', (e) => {
        const shipTypeDiv = e.target.closest('.ship-type');
        this.selectedShip = this.getShip(shipTypeDiv, this.controller[`player${index + 1}`]);
        
        this[`player${index + 1}ShipTypeDivs`].forEach((div) => {
          if(div.dataset.shipType !== shipTypeDiv.dataset.shipType) div.classList.remove('selected');
        });

        if(shipTypeDiv.classList.contains('selected')) {
          shipTypeDiv.classList.remove('selected');
          this.selectedShip = null;
        } else shipTypeDiv.classList.add('selected');
      })
    })
  }
}

export default GameUI;