export default class BoardRenderer {
  constructor(player1Gameboard, player2Gameboard) {
    this.player1Gameboard = player1Gameboard;
    this.player2Gameboard = player2Gameboard;
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
    btnClearAll.title = 'Remove all ships from board';
    btnClearAll.textContent = '🧹'
    divFleetControlsSections.appendChild(btnClearAll);

    const btnRandomAll = this.createHTMLElement(['btn-random-all'], undefined, 'button');
    btnRandomAll.title = 'Randomly position all ships';
    btnRandomAll.textContent = '🔀'
    divFleetControlsSections.appendChild(btnRandomAll);

    divShipsRemaining.appendChild(divFleetControlsSections);

    return divShipsRemaining;
  }

  createPlayer1BoardSection() {
    const divBoardSection = this.createHTMLElement(['board-section']);
    
    const h2 = this.createHTMLElement(['board-title'], undefined, 'h2');
    h2.textContent = '🛡️ Your Fleet';
    divBoardSection.appendChild(h2);

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
}