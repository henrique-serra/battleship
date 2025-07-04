import Gameboard from "../Gameboard.js";

const gameboard = new Gameboard();
const ships = gameboard.ships;

function getShipCount(ships) {
  const shipCount = ships.reduce((newObj, ship) => {
    newObj[ship] = (newObj[ship] || 0) + 1;
    return newObj;
  }, {});

  return shipCount;
}

const shipCount = getShipCount(ships);

export default class BoardRenderer {
  constructor(playerContainer, opponentContainer) {
    this.playerContainer = playerContainer;
    this.opponentContainer = opponentContainer;
  }

  createGameBoardsHTML() {
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    function createGrid(boardId) {
      let gridHTML = `<div class="grid" id="${boardId}">`;
      
      // Primeira linha - header com coordenadas
      gridHTML += '<div class="grid-cell coordinate"></div>'; // canto vazio
      columns.forEach(col => {
        gridHTML += `<div class="grid-cell coordinate">${col}</div>`;
      });
      
      // Linhas 1-10 do jogo
      for (let row = 1; row <= 10; row++) {
        // Primeira célula da linha - número da linha
        gridHTML += `<div class="grid-cell coordinate">${row}</div>`;
        
        // Células de jogo da linha
        columns.forEach(col => {
          const position = `${col}${row}`;
          const rowIndex = row - 1; // Para array 0-indexed
          const colIndex = columns.indexOf(col); // Para array 0-indexed
          
          gridHTML += `<div class="grid-cell" data-position="${position}" data-row="${rowIndex}" data-col="${colIndex}"></div>`;
        });
      }
      
      gridHTML += '</div>';
      return gridHTML;
    }
    
    return `
      <div class="game-boards">
        <div class="board-section">
          <h2 class="board-title">🛡️ Your Fleet</h2>
          ${createGrid('player-board')}
          <div class="ships-remaining">
            <div class="ship-type" data-ship-type="carrier">
              <span class="ship-name">🛳️ Carrier (5)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
              <span class="ship-count">1</span>
            </div>
            <div class="ship-type" data-ship-type="battleship">
              <span class="ship-name">🚢 Battleship (4)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="destroyer">
              <span class="ship-name">🛥️ Destroyer (3)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="submarine">
              <span class="ship-name">🚤 Submarine (2)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="patrol">
              <span class="ship-name">⛵ Patrol (1)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="fleet-controls-section">
              <button class="btn-clear-all" title="Remove all ships from board">🧹</button>
              <button class="btn-random-all" title="Randomly position all ships">🔀</button>
            </div>
          </div>
        </div>
        <div class="board-section">
          <h2 class="board-title">🎯 Enemy Field</h2>
          ${createGrid('enemy-board')}
          <div class="ships-remaining">
            <div class="ship-type" data-ship-type="carrier">
              <span class="ship-name">🛳️ Carrier (5)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="battleship">
              <span class="ship-name">🚢 Battleship (4)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="destroyer">
              <span class="ship-name">🛥️ Destroyer (3)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="submarine">
              <span class="ship-name">🚤 Submarine (2)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="ship-type" data-ship-type="patrol">
              <span class="ship-name">⛵ Patrol (1)</span>
              <span class="btn-random" title="Randomly position ship">🔀</span>
            </div>
            <div class="fleet-controls-section">
              <button class="btn-clear-all" title="Remove all ships from board">🧹</button>
              <button class="btn-random-all" title="Randomly position all ships">🔀</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}