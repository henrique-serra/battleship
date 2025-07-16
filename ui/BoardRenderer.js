import Controller from "../Controller.js";

export default class BoardRenderer {
  constructor() {
    this.controller = new Controller();
    this.player1Gameboard = this.controller.player1.gameboard;
    this.player2Gameboard = this.controller.player2.gameboard;
    this.renderBoards();
    this.horizontally = true;
  }

  renderBoards() {
    const currentDivGameBoard = document.querySelector('.game-boards');
    if (currentDivGameBoard) currentDivGameBoard.remove();
    
    const divGameBoard = this.createDivGameBoards();
    const divControls = document.querySelector('.controls');
    divControls.before(divGameBoard);
  }

  createHTMLElement(classes = undefined, id = undefined, element = 'div') {
      const el = document.createElement(element);

      if (el.constructor.name === 'HTMLUnknownElement') {
        throw new Error(`Invalid HTML Element: ${element}`);
      }
  
      if (classes && classes.length > 0) {
        classes.forEach((cl) => {
          el.classList.add(cl);
        })
      };
  
      if (id) el.id = id;

      return el;
  }

  createGrid(boardId) {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    const divGrid = this.createHTMLElement(['grid'], boardId);

    const upperLeftCorner = this.createHTMLElement(['grid-cell', 'coordinate']);
    divGrid.appendChild(upperLeftCorner);

    columns.forEach((col) => {
      const divColHeader = this.createHTMLElement(['grid-cell', 'coordinate']);
      divColHeader.textContent = col;
      divGrid.appendChild(divColHeader);
    });

    for (let row = 1; row <= 10; row++) {
      const divRowHeader = this.createHTMLElement(['grid-cell', 'coordinate']);
      divRowHeader.textContent = row;
      divGrid.appendChild(divRowHeader);

      columns.forEach((col) => {
        const position = `${col}${row}`;
        const rowIndex = row - 1;
        const colIndex = columns.indexOf(col);

        const gameCell = this.createHTMLElement(['grid-cell']);
        gameCell.dataset.position = position;
        gameCell.dataset.row = rowIndex;
        gameCell.dataset.col = colIndex;
        divGrid.appendChild(gameCell);
      });
    };

    return divGrid;
  }

  createShipsRemainingDiv(gameboard) {
    const firstLetterCaps = function firstLetterCaps(str) {
      return str[0].toUpperCase().concat(str.slice(1));
    }
    
    const shipsGroupedByName = gameboard.shipsGroupedByName;
    const divShipsRemaining = this.createHTMLElement(['ships-remaining']);
    
    // Ship type divs
    Object.entries(shipsGroupedByName).forEach(([shipType, ships]) => {
      const divShipType = this.createHTMLElement(['ship-type']);
      divShipType.dataset.shipType = shipType;

      const spanShipName = this.createHTMLElement(['ship-name'], undefined, 'span');
      spanShipName.textContent = `${ships[0].shipInfo.emoji} ${firstLetterCaps(shipType)} (${ships[0].shipInfo.length})`;
      divShipType.appendChild(spanShipName);

      const spanBtnRandom = this.createHTMLElement(['btn-random'], undefined, 'span');
      spanBtnRandom.title = 'Randomly position ship';
      spanBtnRandom.textContent = '🔀';
      divShipType.appendChild(spanBtnRandom);

      const spanShipCount = this.createHTMLElement(['ship-count'], undefined, 'span');
      spanShipCount.textContent = ships.length;
      divShipType.appendChild(spanShipCount);

      divShipsRemaining.appendChild(divShipType);
    });

    const divFleetControlsSections = this.createHTMLElement(['fleet-controls-section']);
    
    const btnClearAll = this.createHTMLElement(['btn-clear-all'], undefined, 'button');
    btnClearAll.dataset.board = gameboard === this.player1Gameboard ? 'player' : 'enemy';
    btnClearAll.title = 'Remove all ships from board';
    btnClearAll.textContent = '🧹'
    divFleetControlsSections.appendChild(btnClearAll);

    const btnRandomAll = this.createHTMLElement(['btn-random-all'], undefined, 'button');
    btnRandomAll.dataset.board = gameboard === this.player1Gameboard ? 'player' : 'enemy';
    btnRandomAll.title = 'Randomly position all ships';
    btnRandomAll.textContent = '🔀'
    divFleetControlsSections.appendChild(btnRandomAll);

    divShipsRemaining.appendChild(divFleetControlsSections);

    return divShipsRemaining;
  }

  createToggle() {
    const orientationToggleDiv = document.createElement('div');
    orientationToggleDiv.id = 'orientationToggle';
    orientationToggleDiv.classList.add('toggle-switch');
    
    const toggleSlider = document.createElement('div');
    toggleSlider.classList.add('toggle-slider');
    toggleSlider.textContent = '↔️';

    orientationToggleDiv.appendChild(toggleSlider);

    return orientationToggleDiv;
  }

  updateOrientation() {
    const toggle = document.querySelector('#orientationToggle');
    const slider = toggle.querySelector('.toggle-slider');

    if (!this.horizontally) {
      toggle.classList.add('vertical');
      slider.textContent = '↕️';
    } else {
      toggle.classList.remove('vertical');
      slider.textContent = '↔️';
    }

    console.log(`Orientation: ${this.horizontally ? 'Horizontal' : 'Vertical'}`);
  }

  createPlayer1BoardSection() {
    const divBoardSection = this.createHTMLElement(['board-section']);

    const divBoardHeader = this.createHTMLElement(['board-section-header']);

    const toggleOrientation = this.createToggle();
    divBoardHeader.appendChild(toggleOrientation);

    
    const h2 = this.createHTMLElement(['board-title-player1'], undefined, 'h2');
    h2.textContent = '🛡️ Your Fleet';
    divBoardHeader.appendChild(h2);

    divBoardSection.appendChild(divBoardHeader);

    const grid = this.createGrid('player-board');
    divBoardSection.appendChild(grid);

    const divShipsRemaining = this.createShipsRemainingDiv(this.player1Gameboard);
    divBoardSection.appendChild(divShipsRemaining);

    return divBoardSection;
  }

  createPlayer2BoardSection() {
    const divBoardSection = this.createHTMLElement(['board-section']);
    
    const h2 = this.createHTMLElement(['board-title'], undefined, 'h2');
    h2.textContent = '🎯 Enemy Field';
    divBoardSection.appendChild(h2);

    const grid = this.createGrid('enemy-board');
    divBoardSection.appendChild(grid);

    const divShipsRemaining = this.createShipsRemainingDiv(this.player2Gameboard);
    divBoardSection.appendChild(divShipsRemaining);

    return divBoardSection;
  }

  createDivGameBoards() {
    const divGameBoard = this.createHTMLElement(['game-boards']);
    const player1BoardSection = this.createPlayer1BoardSection();
    const player2BoardSection = this.createPlayer2BoardSection();

    divGameBoard.appendChild(player1BoardSection);
    divGameBoard.appendChild(player2BoardSection);

    return divGameBoard;
  }

  updateCell(boardId, row, col, state, text = undefined) {
    const board = document.getElementById(boardId);
    row = String(row);
    col = String(col);
    const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    if (!cell) {
      console.error(`Cell not found: ${boardId} [${row}, ${col}]`);
      return;
    }

    cell.classList.remove('hit', 'miss', 'ship', 'sunk');
    
    if (state) cell.classList.add(state);
    if (text) cell.textContent = text;

    return cell;
  }

  showHit(boardId, row, col) {
    this.updateCell(boardId, row, col, 'hit');
  }

  showMiss(boardId, row, col) {
    this.updateCell(boardId, row, col, 'miss');
  }

  showShip(boardId, row, col, text = undefined) {
    this.updateCell(boardId, row, col, 'ship', text);
  }

  showSunk(boardId, row, col) {
    this.updateCell(boardId, row, col, 'sunk');
  }

  placeShip(ship, boardId) {
    ship.positions.forEach(([row, col]) => this.showShip(boardId, row, col, ship.shipInfo.emoji));
  }

  removeShip(ship, boardId) {
    ship.positions.forEach(([row, col]) => {
      this.updateCell(boardId, row, col, '', ' ');
    });
  }

  disableShipTypeDiv(shipType, boardId) {
    const shipTypeDiv = this.getShipTypeDiv(shipType, boardId);

    shipTypeDiv.classList.remove('selected');
    shipTypeDiv.classList.add('disabled');
  }

  enableShipTypeDiv(shipType, boardId) {
    const shipTypeDiv = this.getShipTypeDiv(shipType, boardId);
    shipTypeDiv.classList.remove('disabled');
  }

  getShipTypeDiv(shipType, boardId) {
    let index;
    if (boardId === 'player-board') {
      index = 0;
    } else if (boardId === 'enemy-board') {
      index = 1;
    } else {
      throw new Error('Board id not recognized');
    }

    return document.querySelectorAll(`[data-ship-type="${shipType}"]`)[index];
  }

  showAttackPhaseModal() {
    const modal = document.createElement('div');
    modal.className = 'attack-phase-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>🚢 All ships positioned!</h2>
        <p>Attack phase begins now!</p>
        <div class="players-ready">
          <span class="player-indicator">Player 1 ✓</span>
          <span class="player-indicator">Player 2 ✓</span>
        </div>
        <button class="btn-start-attacks">
          Start Battleship! ⚔️
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleKeyDown)
      }
    };

    const btnStartAttacks = modal.querySelector('.btn-start-attacks');
    
    btnStartAttacks.addEventListener('click', () => {
      this.controller.setPhase('attacks');
      
      document.querySelectorAll('.fleet-controls-section').forEach((div) => {
        div.classList.add('disabled');
      });

      this.closeModal(modal);
      console.log(this.controller.gamePhase);
    });
    
    document.addEventListener('keydown', handleKeyDown);
  }

  showWinnerModal(winner) {
    const winnerModal = this.createHTMLElement(['modal'], 'winnerModal', 'div');
    
    const modalWinnerContent = this.createHTMLElement(['modal-winner-content']);
    
    const spanClose = this.createHTMLElement(['close'], undefined, 'span');
    spanClose.textContent = 'x';
    spanClose.addEventListener('click', () => {
      this.closeModal(winnerModal);
    });
    modalWinnerContent.appendChild(spanClose);
    
    const h2 = this.createHTMLElement(['winner-title'], undefined, 'h2');
    h2.textContent = '🏆 Winner!';
    modalWinnerContent.appendChild(h2);
    
    const p = this.createHTMLElement(['winner-name'], 'winnerName', 'p');
    p.textContent = winner;
    modalWinnerContent.appendChild(p);
    
    const button = this.createHTMLElement(['ok-button']);
    button.textContent = 'OK';
    button.addEventListener('click', () => this.closeModal(winnerModal));
    modalWinnerContent.appendChild(button);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(winnerModal);
        document.removeEventListener('keydown', handleKeyDown)
      }
    };

    winnerModal.appendChild(modalWinnerContent);
    winnerModal.addEventListener('click', (e) => {
      if (e.target === winnerModal) {
        this.closeModal(winnerModal);
      }
    });

    document.body.appendChild(winnerModal);
    document.addEventListener('keydown', handleKeyDown);
  }

  closeModal(modal) {
    modal.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
        if (modal && modal.parentNode) {
            modal.remove();
        }
    }, 300);
  }

  updateMultipleCells(boardId, positions, state) {
    positions.forEach(([row, col]) => {
      this.updateCell(boardId, row, col, state);
    });
  }

  showAllShips(boardId, gameboard) {
    gameboard.ships.forEach(ship => {
      ship.positions.forEach(([row, col]) => {
        this.showShip(boardId, row, col);
      });
    });
  }

  updateShipCount(boardId, shipType) {
    const gameboard = boardId === 'player-board' ? this.player1Gameboard : this.player2Gameboard;
    const newCount = String(gameboard.getQtyShipsNotPositioned(shipType));
    
    const board = document.querySelector(`#${boardId}`);
    const shipTypeDiv = board.nextElementSibling.querySelector(`[data-ship-type="${shipType}"]`);
    if (shipTypeDiv) {
      const countSpan = shipTypeDiv.querySelector('.ship-count');
      if (countSpan) {
        countSpan.textContent = newCount;
      }
    }

    return newCount;
  }

  selectShip(shipType, boardId) {
    const shipTypeDiv = this.getShipTypeDiv(shipType, boardId);
    shipTypeDiv.classList.add('selected');
  }

  clearShipSelection(shipType, boardId) {
    const shipTypeDiv = this.getShipTypeDiv(shipType, boardId);
    shipTypeDiv.classList.remove('selected');
  }

  updateShotsCount() {
    const shotsTakenDiv = document.querySelector('#shots-taken');
    shotsTakenDiv.textContent = this.controller.player1.attacks.length;
  }

  updateHitsCount() {
    const hitsDiv = document.querySelector('#hits');
    hitsDiv.textContent = this.controller.player1.attacks.filter(([ r, c, hit ]) => hit).length;
  }

  updatePrecisionPercentage() {
    const shotsCount = this.controller.player1.attacks.length;
    const hitsCount = this.controller.player1.attacks.filter(([r, c, hit]) => hit).length;
    const precision = (shotsCount === 0) ? '' : `${((hitsCount / shotsCount) * 100).toFixed(2)}%`;
    const precisionDiv = document.querySelector('#precision');
    precisionDiv.textContent = precision;
  }
}