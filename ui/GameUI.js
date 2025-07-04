import Controller from "../Controller.js";
import BoardRenderer from "./BoardRenderer.js";

class GameUI {
  constructor() {
    this.controller = new Controller();
    this.boardRenderer = new BoardRenderer(this.player1BoardEl, this.player2BoardEl);
    this.gameBoardsDiv = this.createElement(this.boardRenderer.createGameBoardsHTML());
    // Add to DOM
    this.gameInfoDiv = document.querySelector('.game-info');
    this.gameInfoDiv.after(this.gameBoardsDiv);

    // Select elements
    this.shotsTakenEl = document.querySelector('#shots-taken');
    this.hitsEl = document.querySelector('#hits');
    this.precisionEl = document.querySelector('#precision');
    this.newGameBtn = document.querySelector('#new-game');
    this.player1BoardEl = document.querySelector('#player-board');
    this.player2BoardEl = document.querySelector('#enemy-board');
    this.boardSections = document.querySelectorAll('.board-section');
    this.player1ShipsRemainingDiv = this.boardSections[0].querySelector('.ships-remaining');
    this.player2ShipsRemainingDiv = this.boardSections[1].querySelector('.ships-remaining');
    this.player1ShipTypeDivs = this.player1ShipsRemainingDiv.querySelectorAll('.ship-type');
    this.player2ShipTypeDivs = this.player2ShipsRemainingDiv.querySelectorAll('.ship-type');
    this.player1BtnRandom = this.player1ShipsRemainingDiv.querySelectorAll('.btn-random');
    this.player2BtnRandom = this.player2ShipsRemainingDiv.querySelectorAll('.btn-random');
    this.player1BtnClearAll = this.player1ShipsRemainingDiv.querySelector('.btn-clear-all');
    this.player2BtnClearAll = this.player2ShipsRemainingDiv.querySelector('.btn-clear-all');
    this.player1BtnRandomAll = this.player1ShipsRemainingDiv.querySelector('.btn-random-all');
    this.player2BtnRandomAll = this.player2ShipsRemainingDiv.querySelector('.btn-random-all');
    
    // Positioning ships
    this.selectedShip = null;
    this.isPlacingShip = false;
    this.shipOrientation = 'horizontal';
    
    this.player1Ships = this.controller.player1.gameboard.ships;
    this.player2Ships = this.controller.player2.gameboard.ships;

    this.setupHandlers();
  }

  getShip(shipTypeDiv, player) {
    if(!(shipTypeDiv instanceof HTMLDivElement)) throw new Error('First param must be a div');
    if(!shipTypeDiv.classList.contains('ship-type')) throw new Error('Div must contain class "ship-type"');

    const shipType = shipTypeDiv.dataset.shipType;

    return player.gameboard.ships.find(({ shipInfo }) => shipInfo.name === shipType);
  }

  getShipsToBePlaced(shipType, player) {
    const shipsGroupedByName = player.gameboard.shipsGroupedByName;
    console.log(shipsGroupedByName);
    const shipsToBePlaced = Object.entries(shipsGroupedByName).filter(([shipName, ship]) => {
      return shipName === shipType && ship.positions.length === 0;
    })

    return shipsToBePlaced;
  }

  placeShipOnBoard(ship) {
    let playerNumber;
    if (this.controller.player1.gameboard.ships.includes(ship)) {
      playerNumber = '1';
    } else if (this.controller.player2.gameboard.ships.includes(ship)) {
      playerNumber = '2';
    } else return null;
    
    ship.positions.forEach(([row, col]) => {
      const cell = this[`player${playerNumber}BoardEl`].querySelector(`[data-row="${row}"][data-col="${col}"]`);

      cell.classList.add('ship', ship.shipInfo.name);
    });
  }

  removeShipOnBoard(ship) {
    let playerNumber;
    if (this.controller.player1.gameboard.ships.includes(ship)) {
      playerNumber = '1';
    } else if (this.controller.player2.gameboard.ships.includes(ship)) {
      playerNumber = '2';
    } else return null;
    
    ship.positions.forEach(([row, col]) => {
      const cell = this[`player${playerNumber}BoardEl`].querySelector(`[data-row="${row}"][data-col="${col}"]`);
      cell.classList.remove('ship');
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

      if (
        // Positioning
        this.controller.gamePhase === 'positioning' &&
        this.selectedShip &&
        this.selectedShip.positions.length === 0
      ) {
        this.controller.player1.gameboard.placeShip(this.selectedShip, row, col);
        this.placeShipOnBoard(this.selectedShip, '1');
      } else if (
        // Removing from board with ship selected
        this.controller.gamePhase === 'positioning' &&
        this.selectedShip &&
        this.selectedShip.positions.length !== 0 &&
        row == this.selectedShip.positions[0][0] &&
        col == this.selectedShip.positions[0][1]
      ) {
        this.removeShipOnBoard(this.selectedShip);
        this.controller.player1.gameboard.removeShip(this.selectedShip);
      } else if (
        // Removing from board with no ship selected
        this.controller.gamePhase === 'positioning' &&
        !this.selectedShip &&
        gameCell.classList.contains('ship')
      ) {
        const shipOnCell = this.controller.player1.gameboard.defenseBoard[row][col].ship;
        this.removeShipOnBoard(shipOnCell);
        this.controller.player1.gameboard.removeShip(shipOnCell);
      } else if (
        // Repositioning
        this.controller.gamePhase === 'positioning' &&
        this.selectedShip &&
        this.selectedShip.positions.length !== 0
      ) {
        this.removeShipOnBoard(this.selectedShip);
        this.controller.player1.gameboard.removeShip(this.selectedShip);
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
      const player = this.controller[`player${index + 1}`];
      
      shipRemainingDiv.addEventListener('click', (e) => {
        const elementClicked = e.target;
        const shipTypeDiv = elementClicked.closest('.ship-type');
        this.selectedShip = this.getShip(shipTypeDiv, player);
        
        if (elementClicked.matches('.btn-random')) {
          if(this.selectedShip.positions.length > 0) {
            this.removeShipOnBoard(this.selectedShip);
            player.gameboard.removeShip(this.selectedShip);
          }
          player.gameboard.placeShipRandomly(this.selectedShip);
          this.placeShipOnBoard(this.selectedShip);
          e.stopPropagation();
          return;
        }
        
        this[`player${index + 1}ShipTypeDivs`].forEach((div) => {
          if(div.dataset.shipType !== shipTypeDiv.dataset.shipType) div.classList.remove('selected');
        });

        if(shipTypeDiv.classList.contains('selected')) {
          shipTypeDiv.classList.remove('selected');
          this.selectedShip = null;
        } else shipTypeDiv.classList.add('selected');
      })
    });

    const buttonsClearAll = [this.player1BtnClearAll, this.player2BtnClearAll];
    buttonsClearAll.forEach((btnClearAll, index) => {
      const player = this.controller[`player${index + 1}`];
      btnClearAll.addEventListener('click', (e) => {
        player.gameboard.ships.forEach((ship) => {
          this.removeShipOnBoard(ship);
          player.gameboard.removeShip(ship);
        })
      })
    });

    const buttonsRandomAll = [this.player1BtnRandomAll, this.player2BtnRandomAll];
    buttonsRandomAll.forEach((btnRandomAll, index) => {
      const player = this.controller[`player${index + 1}`];
      btnRandomAll.addEventListener('click', (e) => {
        player.gameboard.ships.forEach((ship) => {
          if (ship.positions.length > 0) {
            this.removeShipOnBoard(ship);
            player.gameboard.removeShip(ship);
          }
          player.gameboard.placeShipRandomly(ship);
          this.placeShipOnBoard(ship);
        })
      })
    })
  }
}

export default GameUI;